<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Learner;
use App\Models\User;
use App\Mail\EnrollmentAccepted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BackfillUserAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backfill-user-accounts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create user accounts for existing learners who do not have one.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to backfill user accounts for existing learners...');

        // Find all learners who don't have a user_id associated with them yet.
        // We eager load the 'address' relationship to get the email efficiently.
        $learnersWithoutAccounts = Learner::whereNull('user_id')->with('address')->get();

        if ($learnersWithoutAccounts->isEmpty()) {
            $this->info('No learners found without user accounts. All learners are up to date.');
            return 0;
        }

        $this->info("Found " . $learnersWithoutAccounts->count() . " learners to process.");
        $progressBar = $this->output->createProgressBar($learnersWithoutAccounts->count());
        $progressBar->start();

        foreach ($learnersWithoutAccounts as $learner) {
            DB::transaction(function () use ($learner, $progressBar) {
                try {
                    // 1. Validate that the learner has an email address
                    if (!$learner->address || !$learner->address->email_address) {
                        $this->warn("\nSkipping Learner ID: {$learner->learner_id} ({$learner->first_name}) due to missing email address.");
                        return; // Continue to the next learner in the loop
                    }

                    $email = $learner->address->email_address;

                    // 2. Check if a user with this email already exists to prevent duplicates
                    if (User::where('email', $email)->exists()) {
                        $this->warn("\nSkipping Learner ID: {$learner->learner_id}. A user with email {$email} already exists.");
                        return;
                    }

                    // 3. Generate a temporary password, just like in your EnrollmentController
                    $temporaryPassword = Str::random(10);

                    // 4. Create the new User record
                    $user = User::create([
                        'name' => $learner->first_name . ' ' . $learner->last_name,
                        'email' => $email,
                        'password' => Hash::make($temporaryPassword),
                        'role' => 'learner', // Assign the learner role
                    ]);

                    // 5. Link the new User to the Learner record and update status
                    $learner->user_id = $user->id;
                    $learner->enrollment_status = 'accepted'; // Mark them as accepted
                    $learner->save();

                    // 6. Send the enrollment email with credentials using your existing Mailable
                    Mail::to($user->email)->send(new EnrollmentAccepted(
                        $learner->first_name,
                        $learner->last_name,
                        $user->email,
                        $temporaryPassword
                    ));

                } catch (\Exception $e) {
                    $this->error("\nFailed to process Learner ID: {$learner->learner_id}. Error: " . $e->getMessage());
                    Log::error("Backfill Error for Learner ID {$learner->learner_id}: " . $e->getMessage());
                    DB::rollBack();
                }
            });
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->info("\nUser account backfill process completed successfully.");
        return 0;
    }
}
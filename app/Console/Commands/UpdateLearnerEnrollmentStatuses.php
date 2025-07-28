<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Learner; // Import your Learner model

class UpdateLearnerEnrollmentStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enrollments:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates null enrollment_status values to "pending" for existing learners.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updatedCount = Learner::whereNull('enrollment_status')
                                ->update(['enrollment_status' => 'pending']);

        $this->info("Updated {$updatedCount} learner(s) with null enrollment_status to 'pending'.");

        // Also ensure any existing 'Pending' (capital P) are normalized to 'pending'
        $normalizedCount = Learner::where('enrollment_status', 'Pending')
                                  ->update(['enrollment_status' => 'pending']);

        if ($normalizedCount > 0) {
            $this->info("Normalized {$normalizedCount} learner(s) with 'Pending' status to 'pending'.");
        }

        $this->info('Enrollment status update complete.');
    }
}
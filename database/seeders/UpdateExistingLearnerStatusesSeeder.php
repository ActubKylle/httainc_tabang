<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Learner; // Import your Learner model

class UpdateExistingLearnerStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $updatedCount = Learner::whereNull('enrollment_status')
                                ->update(['enrollment_status' => 'pending']);

        $this->command->info("Updated {$updatedCount} learner(s) with null enrollment_status to 'pending'.");

        $normalizedCount = Learner::where('enrollment_status', 'Pending')
                                  ->update(['enrollment_status' => 'pending']);

        if ($normalizedCount > 0) {
            $this->command->info("Normalized {$normalizedCount} learner(s) with 'Pending' status to 'pending'.");
        }
    }
}
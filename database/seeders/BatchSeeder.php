<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Batch;
use App\Models\Learner;
use App\Models\CourseEnrollment;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = Program::where('status', 'active')->get();
        $firstBatchCreated = null;

        foreach ($programs as $index => $program) {
            $batch1 = Batch::create([
                'program_id' => $program->id,
                'name' => 'Morning Batch (Weekdays)',
                'schedule_details' => 'Mon-Fri, 8am - 12pm',
            ]);

            Batch::create([
                'program_id' => $program->id,
                'name' => 'Afternoon Batch (Weekdays)',
                'schedule_details' => 'Mon-Fri, 1pm - 5pm',
            ]);
            
            if ($index === 0) {
                $firstBatchCreated = $batch1;
            }
        }

        // --- UPDATED LOGIC ---
        // Find the first learner, regardless of their status.
        $learner = Learner::first();

        if ($firstBatchCreated && $learner) {
            // Force the learner's status to 'accepted' to ensure they can be found.
            $learner->enrollment_status = 'accepted';
            $learner->save();

            // Find their enrollment record
            $enrollment = CourseEnrollment::where('learner_id', $learner->learner_id)->first();
            if ($enrollment) {
                // Assign the student to the first batch of the first program
                $enrollment->batch_id = $firstBatchCreated->id;
                $enrollment->program_id = $firstBatchCreated->program_id;
                $enrollment->save();
            }
        }
    }
}
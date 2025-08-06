<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Learner;
use App\Models\Program;
use App\Models\Batch;
use App\Models\CourseEnrollment;
use Illuminate\Support\Facades\Hash;

class TestingDataSeeder extends Seeder
{
    public function run(): void
    {
        // --- Define the programs you want to create test data for ---
        $testPrograms = [
            [
                'name' => 'Shielded Metal Arc Welding NC II',
                'student' => ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan.delacruz@example.com'],
            ],
            [
                'name' => 'Cookery NC II',
                'student' => ['first_name' => 'Maria', 'last_name' => 'Clara', 'email' => 'maria.clara@example.com'],
            ],
            [
                'name' => 'Bread & Pastry Production NC II',
                'student' => ['first_name' => 'Jose', 'last_name' => 'Rizal', 'email' => 'jose.rizal@example.com'],
            ],
        ];

        foreach ($testPrograms as $testData) {
            // The 'short_name' is no longer passed to the helper function
            $this->seedProgramData(
                $testData['name'],
                $testData['student']
            );
        }
    }

    /**
     * A helper function to seed a complete set of data for one program.
     */
    // FIX: Removed the $shortName parameter
    private function seedProgramData(string $programName, array $studentData): void
    {
        // 1. Find the Program
        $program = Program::where('course_name', $programName)->first();

        if (!$program) {
            $this->command->info("Seeder: Program '{$programName}' not found, skipping.");
            return;
        }

        // 2. Create Batches for this Program with generic names
        $batch = Batch::create([
            'program_id' => $program->id,
            'name' => 'Morning Batch', // FIX: Simplified name
            'schedule_details' => 'Mon-Fri, 8am - 12pm',
        ]);
        
        Batch::create([
            'program_id' => $program->id,
            'name' => 'Afternoon Batch', // FIX: Simplified name
            'schedule_details' => 'Mon-Fri, 1pm - 5pm',
        ]);

        // 3. Create a dedicated User and Learner for testing
        $user = User::create([
            'name' => "{$studentData['first_name']} {$studentData['last_name']}",
            'email' => $studentData['email'],
            'password' => Hash::make('password'),
            'role' => 'learner',
        ]);

        $learner = Learner::create([
            'user_id' => $user->id,
            'first_name' => $studentData['first_name'],
            'last_name' => $studentData['last_name'],
            'enrollment_status' => 'accepted',
            'gender' => 'Male',
            'civil_status' => 'Single',
            'birth_date' => '2000-01-01',
            'age' => 25,
            'nationality' => 'Filipino',
        ]);

        // 4. Create the Course Enrollment to link the Learner, Program, and Batch
        CourseEnrollment::create([
            'learner_id' => $learner->learner_id,
            'program_id' => $program->id,
            'batch_id' => $batch->id,
        ]);
        
        $this->command->info("Seeded: {$studentData['first_name']} {$studentData['last_name']} into '{$batch->name}' for the {$program->course_name} program.");
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program; // Import your Program model

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add some sample programs
        Program::create([
            'course_name' => 'Shielded Metal Arc Welding NC II',
            'qualification_level' => 'NC II',
            'duration_hours' => 268,
            'duration_days' => 30, // Example
            'description' => 'This program covers the skills and knowledge required for shielded metal arc welding.',
            'status' => 'active',
        ]);

        Program::create([
            'course_name' => 'Cookery NC II',
            'qualification_level' => 'NC II',
            'duration_hours' => 316,
            'duration_days' => 40, // Example
            'description' => 'This program covers the knowledge, skills, and attitude required in cookery.',
            'status' => 'active',
        ]);

        Program::create([
            'course_name' => 'Bread and Pastry Production NC II',
            'qualification_level' => 'NC II',
            'duration_hours' => 187,
            'duration_days' => 25, // Example
            'description' => 'This program covers the preparation and production of bread and pastry products.',
            'status' => 'active',
        ]);

        // Add more programs as needed for testing
    }
}
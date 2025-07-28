<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Ensure User model is imported if you create a user directly here

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call your specific seeders here
        $this->call([
           ClassificationSeeder::class,
            DisabilityTypeSeeder::class, // If you create one for disability types
                ProgramSeeder::class,

            LearnerSeeder::class,
            AdminUserSeeder::class, // If you create one for admin users
        ]);
    }
}
<?php

namespace Database\Seeders;

use App\Models\User; // Make sure your User model is imported
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // For hashing passwords

class StaffUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default admin user if one with this email doesn't already exist
        User::firstOrCreate(
            ['email' => 'staff@htta.com'], // Unique identifier for the admin
            [
                'name' => 'HTTA Staff',
                'password' => Hash::make('password123'), // **CHANGE THIS TO A SECURE PASSWORD IN PRODUCTION**
                'role' => 'staff', // Assign the 'admin' role
                'email_verified_at' => now(), // Mark as verified for immediate login access
            ]
        );

        $this->command->info('Default staff user created: staff@htta.com (password: password)');
    }
}
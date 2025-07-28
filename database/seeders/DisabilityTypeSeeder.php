<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DisabilityType;

class DisabilityTypeSeeder extends Seeder
{
    public function run(): void
    {
        DisabilityType::firstOrCreate(['name' => 'Mentally Challenged']);
        DisabilityType::firstOrCreate(['name' => 'Hearing Disability']);
        DisabilityType::firstOrCreate(['name' => 'Visual Disability']);
        DisabilityType::firstOrCreate(['name' => 'Orthopedic Disability']);
        DisabilityType::firstOrCreate(['name' => 'Speech Impairment']);
        DisabilityType::firstOrCreate(['name' => 'Multiple Disabilities']);
        // Add more as needed based on your forms
    }
}
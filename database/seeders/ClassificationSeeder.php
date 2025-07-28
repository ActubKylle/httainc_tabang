<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classification; // Make sure this is present

class ClassificationSeeder extends Seeder
{
    public function run(): void
    {
        Classification::firstOrCreate(['type' => '4Ps Beneficiary']);
        Classification::firstOrCreate(['type' => 'Agrarian Reform Beneficiary']);
        Classification::firstOrCreate(['type' => 'Solo Parent']);
        Classification::firstOrCreate(['type' => 'Indigenous People']);
        Classification::firstOrCreate(['type' => 'Former Rebel']);
        Classification::firstOrCreate(['type' => 'Drug Dependent (Rehabilitated)']);
        Classification::firstOrCreate(['type' => 'Disadvantaged Women']);
        Classification::firstOrCreate(['type' => 'Displaced Worker']);
        Classification::firstOrCreate(['type' => 'Returning/Overseas Filipino Worker']);
        Classification::firstOrCreate(['type' => 'Family Member of AFP/PNP/BJMP Personnel']);
        Classification::firstOrCreate(['type' => 'TVET Graduate (NCR)']);
        Classification::firstOrCreate(['type' => 'TVET Graduate (Luzon)']);
        Classification::firstOrCreate(['type' => 'TVET Graduate (Visayas)']);
        Classification::firstOrCreate(['type' => 'TVET Graduate (Mindanao)']);
        Classification::firstOrCreate(['type' => 'PWD']);
        Classification::firstOrCreate(['type' => 'Victims of Calamity']);
        Classification::firstOrCreate(['type' => 'Waste Picker']);
        Classification::firstOrCreate(['type' => 'Fisherfolk']);
        Classification::firstOrCreate(['type' => 'Farmer']);
        Classification::firstOrCreate(['type' => 'Rural Poor']);
        Classification::firstOrCreate(['type' => 'Prisoner/Ex-Prisoner/Family Member of Prisoner']);
        Classification::firstOrCreate(['type' => 'Youth (15-30 years old)']);
        Classification::firstOrCreate(['type' => 'Senior Citizen']);
        Classification::firstOrCreate(['type' => 'Others']); // Corrected syntax
    }
}
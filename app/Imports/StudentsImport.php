<?php

namespace App\Imports;

use App\Models\Learner;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Str;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // 1. Create the User first
        $user = User::create([
            'name'     => $row['first_name'] . ' ' . $row['last_name'],
            'email'    => $row['email'],
            'password' => Hash::make(Str::random(10)), // Generate a random password
            'role'     => 'learner',
        ]);

        // 2. Create the Learner and link it to the new User
        $learner = new Learner([
            'user_id'       => $user->id,
            'first_name'    => $row['first_name'],
            'last_name'     => $row['last_name'],
            'gender'        => $row['gender'],
            'birth_date'    => \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['birth_date']),
            'entry_date'    => now(),
            'enrollment_status' => 'accepted', // Automatically accept imported students
            // ... map other columns from your excel template here
        ]);

        // Note: You would also create related models like LearnerAddress here if needed.
        
        return $learner;
    }

    public function rules(): array
    {
        return [
            '*.email' => ['required', 'email', 'unique:users,email'],
            '*.first_name' => ['required', 'string'],
            '*.last_name' => ['required', 'string'],
        ];
    }
}
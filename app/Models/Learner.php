<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learner extends Model
{
    use HasFactory;

    protected $primaryKey = 'learner_id';
    protected $fillable = [
        'user_id',
        'entry_date',
        'last_name',
        'first_name',
        'middle_name',
        'extension_name',
        'gender',
        'civil_status',
        'birth_date',
        'age',
        'birthplace_city_municipality',
        'birthplace_province',
        'birthplace_region',
        'nationality',
        'employment_status',
        'employment_type',
        'parent_guardian_name',
        'parent_guardian_mailing_address',
        't2mis_auto_generated',
        'enrollment_status', // Add this line
    ];

    protected $casts = [
        'entry_date' => 'date',
        'birth_date' => 'date',
        't2mis_auto_generated' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function address()
    {
        return $this->hasOne(LearnerAddress::class, 'learner_id', 'learner_id');
    }
      public function programs()
    {
        return $this->belongsToMany(Program::class, 'course_enrollments', 'learner_id', 'program_id')
                    ->withPivot('scholarship_package') // Include any pivot table fields you need
                    ->withTimestamps(); // If your pivot table has timestamps
    }

    public function educationalAttainment()
    {
        return $this->hasOne(EducationalAttainment::class, 'learner_id', 'learner_id');
    }

    public function classifications()
    {
        return $this->belongsToMany(Classification::class, 'learner_classifications', 'learner_id', 'classification_id')
                    ->withPivot('other_classification_details')
                    ->withTimestamps();
    }

    public function disabilities()
    {
        return $this->hasMany(Disability::class, 'learner_id', 'learner_id');
    }

    public function courseEnrollments()
    {
        return $this->hasMany(CourseEnrollment::class, 'learner_id', 'learner_id');
    }

    public function privacyConsent()
    {
        return $this->hasOne(PrivacyConsent::class, 'learner_id', 'learner_id');
    }

    public function registrationSignature()
    {
        return $this->hasOne(RegistrationSignature::class, 'learner_id', 'learner_id');
    }
}
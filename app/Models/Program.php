<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model 
{
    use HasFactory;

    protected $table = 'programs'; 
    protected $primaryKey = 'id'; 

    protected $fillable = [
        'course_name', 
        'qualification_level',
        'duration_hours',
        'duration_days',
        'description',
        'status',
        'enrollment_start_date',
        'enrollment_end_date',
    ];


     protected $casts = [
      'enrollment_start_date' => 'date:Y-m-d',
        'enrollment_end_date' => 'date:Y-m-d',
    ];


    // You would define relationships here, for example:
    // public function enrollments()
    // {
    //     return $this->hasMany(CourseEnrollment::class, 'program_id', 'id');
    // }
    // public function assessmentProfiles()
    // {
    //     return $this->hasMany(AssessmentProfile::class, 'program_id', 'id');
    // }
    // public function studentScholarships()
    // {
    //     return $this->hasMany(StudentScholarship::class, 'program_id', 'id');
    // }

    public function courseEnrollments()
    {
        return $this->hasMany(CourseEnrollment::class, 'program_id', 'id');
    }

    // Define the many-to-many relationship with Learner through CourseEnrollment
    public function learners()
    {
        return $this->belongsToMany(Learner::class, 'course_enrollments', 'program_id', 'learner_id')
                    ->withPivot('scholarship_package') // Include any pivot table fields you need
                    ->withTimestamps(); // If your pivot table has timestamps
    }
    public function batches(): HasMany
        {
            return $this->hasMany(Batch::class);
        }
}
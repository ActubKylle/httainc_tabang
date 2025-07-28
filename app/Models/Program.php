<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model // Class name is Program
{
    use HasFactory;

    protected $table = 'programs'; // Maps to the 'programs' table
    protected $primaryKey = 'id'; // Assuming 'id' is the primary key

    protected $fillable = [
        'course_name', // Database column name, but will be used as 'program_name' in UI
        'qualification_level',
        'duration_hours',
        'duration_days',
        'description',
        'status',
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
}
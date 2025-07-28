<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    use HasFactory; // Added this

    protected $primaryKey = 'enrollment_id'; // Assuming 'enrollment_id' is primary key
    protected $fillable = [ // Added fillable attributes
        'learner_id',
        // 'course_qualification',
        'program_id',
        'scholarship_package',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }
     public function program() // Link to the new Program model
    {
        return $this->belongsTo(Program::class, 'program_id', 'id');
    }
}
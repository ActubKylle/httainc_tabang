<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationalAttainment extends Model
{
    use HasFactory; // Added this

    protected $primaryKey = 'education_id'; // Assuming 'education_id' is primary key
    protected $fillable = [ // Added fillable attributes
        'learner_id',
        'no_grade_completed',
        'elementary_undergraduate',
        'elementary_graduate',
        'junior_high_k12',
        'senior_high_k12',
        'high_school_undergraduate',
        'high_school_graduate',
        'post_secondary_non_tertiary_technical_vocational_undergraduate',
        'post_secondary_non_tertiary_technical_vocational_course_graduate',
        'college_undergraduate',
        'college_graduate',
        'masteral',
        'doctorate',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }
}
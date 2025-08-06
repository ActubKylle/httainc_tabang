<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo; 
/**
 * This is a custom pivot model for the student_scholarships table.
 * It allows us to define relationships on the pivot table itself.
 */
class StudentScholarship extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'student_scholarships';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'student_scholarship_id';

    /**
     * Get the documents associated with this specific application.
     * This defines a one-to-one relationship from the application to its documents.
     */
    public function documents(): HasOne
    {
        return $this->hasOne(ScholarshipApplicationDocument::class, 'student_scholarship_id', 'student_scholarship_id');
    }
     public function learner(): BelongsTo
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScholarshipApplicationDocument extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'scholarship_application_documents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_scholarship_id', // Corrected foreign key name
        'birth_certificate_path',
        'transcript_of_records_path',
        'formal_photo_path',
        'parent_id_path',
        'marriage_contract_path',
    ];

    /**
     * Get the scholarship application pivot entry that these documents belong to.
     */
    public function application(): BelongsTo
    {
        // CORRECTED: This now points to the correct pivot model and foreign key.
        return $this->belongsTo(StudentScholarship::class, 'student_scholarship_id');
    }
}

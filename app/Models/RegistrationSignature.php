<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationSignature extends Model
{
    use HasFactory; // Added this

    protected $primaryKey = 'signature_id'; // Assuming 'signature_id' is primary key
    protected $fillable = [ // Added fillable attributes
        'learner_id',
        'applicant_signature_printed_name',
        'date_accomplished',
        'registrar_signature_printed_name',
        'date_received',
        'thumbmark_image_path',
        'picture_image_path',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }
}
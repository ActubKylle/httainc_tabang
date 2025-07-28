<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivacyConsent extends Model
{
    use HasFactory; // Added this

    protected $primaryKey = 'consent_id'; // Assuming 'consent_id' is primary key
    protected $fillable = [ // Added fillable attributes
        'learner_id',
        'consent_given',
        'date_agreed',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }
}
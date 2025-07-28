<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disability extends Model
{
    use HasFactory;

    protected $primaryKey = 'disability_id';
    protected $fillable = [
        'learner_id',
        'disability_type_id',
        'cause_of_disability',
    ];

    public function learner()
    {
        return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
    }

    public function disabilityType()
    {
        return $this->belongsTo(DisabilityType::class);
    }
}
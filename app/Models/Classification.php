<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classification extends Model
{
    use HasFactory;

    protected $fillable = ['type'];

    public function learners()
    {
        return $this->belongsToMany(Learner::class, 'learner_classifications', 'classification_id', 'learner_id')
                            ->withPivot('other_classification_details')
                            ->withTimestamps();
    }
}
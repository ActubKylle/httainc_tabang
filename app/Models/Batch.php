<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Batch extends Model
{
    use HasFactory;
    protected $fillable = [
      'program_id', 
        'name', 
        'schedule_details', 
        'date_started', 
        'date_finished', 
        'training_period'
    
    ];

     protected $casts = [
        'date_started' => 'date:Y-m-d',
        'date_finished' => 'date:Y-m-d',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'timestamp',
        'authenticated',
        'location_status',
    ];

    // If you want to cast 'authenticated' to a boolean automatically
    protected $casts = [
        'authenticated' => 'boolean',
        'timestamp' => 'datetime',
    ];
}

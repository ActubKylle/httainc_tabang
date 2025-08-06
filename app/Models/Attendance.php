<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'learner_id',
        'program_id',
        'batch_id',
        'marked_by_id',
        'attendance_date',
        'time_in',
        'time_out',
        'status',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'attendance_date' => 'date',
        'time_in' => 'datetime',
        'time_out' => 'datetime',
    ];

    /**
     * Get the learner associated with the attendance record.
     */
      public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }
    
    public function learner(): BelongsTo
    {
        return $this->belongsTo(Learner::class, 'learner_id');
    }

    /**
     * Get the program associated with the attendance record.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    /**
     * Get the user (staff) who marked the attendance.
     */
    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by_id');
    }
}
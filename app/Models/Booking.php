<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'room_id',
        'approver_id',
        'booking_date',
        'start_time',
        'end_time',
        'purpose',
        'number_of_participants',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'number_of_participants' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function documents()
    {
        return $this->hasMany(BookingDocument::class, 'booking_id');
    }

    public function usageLog()
    {
        return $this->hasOne(UsageLog::class, 'booking_id');
    }

    public function feedback()
    {
        return $this->hasOne(Feedback::class, 'booking_id');
    }
} 
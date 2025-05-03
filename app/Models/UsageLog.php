<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsageLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'log_id';
    public $incrementing = true;

    protected $fillable = [
        'booking_id',
        'check_in_time',
        'check_out_time',
        'is_late_checkout',
        'issue_reported',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
} 
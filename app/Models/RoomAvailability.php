<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomAvailability extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'availability_id';
    public $incrementing = true;

    protected $fillable = [
        'room_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
} 
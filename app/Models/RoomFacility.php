<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomFacility extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'facility_id';
    public $incrementing = true;

    protected $fillable = [
        'room_id',
        'facility_name',
        'is_available',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
} 
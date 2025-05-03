<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'room_id';
    public $incrementing = true;

    protected $fillable = [
        'building_id',
        'category_id',
        'room_code',
        'room_name',
        'location_detail',
        'capacity',
        'description',
        'status',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id');
    }

    public function category()
    {
        return $this->belongsTo(RoomCategory::class, 'category_id');
    }

    public function facilities()
    {
        return $this->hasMany(RoomFacility::class, 'room_id');
    }

    public function availabilities()
    {
        return $this->hasMany(RoomAvailability::class, 'room_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'room_id');
    }

    public function maintenanceLogs()
    {
        return $this->hasMany(MaintenanceLog::class, 'room_id');
    }
} 
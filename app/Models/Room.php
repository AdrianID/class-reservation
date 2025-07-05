<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'building_id',
        'category_id',
        'room_code',
        'room_name',
        'location_detail',
        'capacity',
        'description',
        'status',
        'image_path',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'status' => 'string',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(RoomCategory::class);
    }

    // New many-to-many relationship with Facility
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'room_facility')
            ->withPivot('quantity', 'notes')
            ->withTimestamps();
    }

    // Keep old relationship for backward compatibility (deprecated)
    public function oldFacilities(): HasMany
    {
        return $this->hasMany(RoomFacility::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(RoomAvailability::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function maintenanceLogs(): HasMany
    {
        return $this->hasMany(MaintenanceLog::class);
    }

    // Scope untuk filter berdasarkan fasilitas
    public function scopeWithFacility($query, $facilityId)
    {
        return $query->whereHas('facilities', function ($q) use ($facilityId) {
            $q->where('facility_id', $facilityId);
        });
    }

    // Scope untuk filter berdasarkan beberapa fasilitas
    public function scopeWithFacilities($query, array $facilityIds)
    {
        return $query->whereHas('facilities', function ($q) use ($facilityIds) {
            $q->whereIn('facility_id', $facilityIds);
        });
    }
} 
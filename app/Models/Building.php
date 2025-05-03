<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'building_id';
    public $incrementing = true;

    protected $fillable = [
        'faculty_id',
        'building_name',
        'description',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'building_id');
    }
} 
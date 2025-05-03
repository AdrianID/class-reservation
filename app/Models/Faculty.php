<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'faculty_id';
    public $incrementing = true;

    protected $fillable = [
        'faculty_name',
        'description',
    ];

    public function buildings()
    {
        return $this->hasMany(Building::class, 'faculty_id');
    }
} 
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'faculty_name',
        'description',
    ];

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }
} 
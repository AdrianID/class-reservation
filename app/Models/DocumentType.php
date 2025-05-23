<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type_name',
        'description',
    ];

    public function bookingDocuments(): HasMany
    {
        return $this->hasMany(BookingDocument::class);
    }
} 
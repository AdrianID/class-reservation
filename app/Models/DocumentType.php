<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentType extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'type_id';
    public $incrementing = true;

    protected $fillable = [
        'type_name',
        'description',
    ];

    public function bookingDocuments()
    {
        return $this->hasMany(BookingDocument::class, 'type_id');
    }
} 
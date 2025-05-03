<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'document_id';
    public $incrementing = true;

    protected $fillable = [
        'booking_id',
        'file_name',
        'file_path',
        'type_id',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function type()
    {
        return $this->belongsTo(DocumentType::class, 'type_id');
    }
} 
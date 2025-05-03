<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_documents', function (Blueprint $table) {
            $table->id('document_id');
            $table->foreignId('booking_id')->constrained('bookings');
            $table->string('file_name');
            $table->string('file_path');
            $table->foreignId('type_id')->constrained('document_types');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_documents');
    }
}; 
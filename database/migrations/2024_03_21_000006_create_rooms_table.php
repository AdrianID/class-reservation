<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('room_categories')->onDelete('cascade');
            $table->string('room_code')->unique();
            $table->string('room_name');
            $table->string('location_detail')->nullable();
            $table->integer('capacity');
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'maintenance', 'booked'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
}; 
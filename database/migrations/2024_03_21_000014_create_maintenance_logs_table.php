<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->id('maintenance_id');
            $table->foreignId('room_id')->constrained('rooms');
            $table->text('description');
            $table->date('maintenance_date');
            $table->string('performed_by');
            $table->enum('status', ['scheduled', 'completed'])->default('scheduled');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
}; 
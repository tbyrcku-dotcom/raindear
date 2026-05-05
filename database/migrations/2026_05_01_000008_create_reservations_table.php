<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->unsignedSmallInteger('guest_count')->default(2);
            $table->string('occasion_type')->nullable(); // casual|birthday|meeting|date|family
            $table->text('notes')->nullable();
            $table->string('status')->default('pending')->index(); // pending|confirmed|cancelled|completed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_assets', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('category')->index(); // interior|food|beverage|event|ambience
            $table->string('image_path');
            $table->string('alt_text');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_assets');
    }
};

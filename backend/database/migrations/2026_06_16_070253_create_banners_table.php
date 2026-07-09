<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->string('subtitle_bn', 500)->nullable();
            $table->string('subtitle_en', 500)->nullable();
            $table->string('image_url', 500);
            $table->string('link_url', 500)->nullable();
            $table->string('placement', 100)->default('hero');
            $table->boolean('is_active')->default(true);
            $table->dateTime('starts_at', 3)->nullable();
            $table->dateTime('ends_at', 3)->nullable();
            $table->bigInteger('sort_order')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_banners_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};

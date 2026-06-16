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
        Schema::create('page_sections', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('page_id')->index('idx_page_sections_page_id');
            $table->string('section_key', 100);
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->longText('content_bn')->nullable();
            $table->longText('content_en')->nullable();
            $table->json('extra_data')->nullable();
            $table->bigInteger('sort_order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};

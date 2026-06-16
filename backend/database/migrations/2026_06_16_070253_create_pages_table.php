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
        Schema::create('pages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('slug', 320)->unique('idx_pages_slug');
            $table->string('title_bn');
            $table->string('title_en');
            $table->longText('content_bn')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('status', 20)->default('draft');
            $table->string('meta_title_bn')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_desc_bn')->nullable();
            $table->text('meta_desc_en')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->dateTime('published_at', 3)->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_pages_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};

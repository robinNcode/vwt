<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name_bn')->nullable();
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('description_bn')->nullable();
            $table->string('description_en')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('image_url')->nullable();
            $table->string('meta_title_bn')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->string('meta_desc_bn')->nullable();
            $table->string('meta_desc_en')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};

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
        Schema::create('attributes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('group_id')->nullable()->index('idx_attributes_group_id');
            $table->string('name_bn', 150);
            $table->string('name_en', 150);
            $table->string('slug', 160)->unique('idx_attributes_slug');
            $table->string('input_type', 20)->default('select');
            $table->string('unit', 30)->nullable();
            $table->boolean('is_variant_attr')->default(false);
            $table->bigInteger('sort_order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};

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
        Schema::create('product_variant_attributes', function (Blueprint $table) {
            $table->unsignedBigInteger('variant_id')->index('idx_product_variant_attributes_variant_id');
            $table->unsignedBigInteger('attribute_id')->index('fk_product_variant_attributes_attribute');
            $table->unsignedBigInteger('option_id')->index('fk_product_variant_attributes_option');

            $table->primary(['variant_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variant_attributes');
    }
};

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
        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('product_id')->index('idx_product_attribute_values_product_id');
            $table->unsignedBigInteger('attribute_id')->index('fk_product_attribute_values_attribute');
            $table->unsignedBigInteger('option_id')->nullable()->index('fk_product_attribute_values_option');
            $table->string('value_custom', 500)->nullable();

            $table->unique(['product_id', 'attribute_id'], 'uq_prod_attr');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute_values');
    }
};

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
        Schema::table('product_attribute_values', function (Blueprint $table) {
            $table->foreign(['attribute_id'], 'fk_product_attribute_values_attribute')->references(['id'])->on('attributes')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['option_id'], 'fk_product_attribute_values_option')->references(['id'])->on('attribute_options')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['product_id'], 'fk_products_attribute_values')->references(['id'])->on('products')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_attribute_values', function (Blueprint $table) {
            $table->dropForeign('fk_product_attribute_values_attribute');
            $table->dropForeign('fk_product_attribute_values_option');
            $table->dropForeign('fk_products_attribute_values');
        });
    }
};

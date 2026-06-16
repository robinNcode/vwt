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
        Schema::table('product_variant_attributes', function (Blueprint $table) {
            $table->foreign(['attribute_id'], 'fk_product_variant_attributes_attribute')->references(['id'])->on('attributes')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['option_id'], 'fk_product_variant_attributes_option')->references(['id'])->on('attribute_options')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['variant_id'], 'fk_product_variants_attributes')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variant_attributes', function (Blueprint $table) {
            $table->dropForeign('fk_product_variant_attributes_attribute');
            $table->dropForeign('fk_product_variant_attributes_option');
            $table->dropForeign('fk_product_variants_attributes');
        });
    }
};

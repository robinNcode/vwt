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
        Schema::table('product_prices', function (Blueprint $table) {
            $table->foreign(['currency_id'], 'fk_product_prices_currency')->references(['id'])->on('currencies')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['variant_id'], 'fk_product_variants_prices')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_prices', function (Blueprint $table) {
            $table->dropForeign('fk_product_prices_currency');
            $table->dropForeign('fk_product_variants_prices');
        });
    }
};

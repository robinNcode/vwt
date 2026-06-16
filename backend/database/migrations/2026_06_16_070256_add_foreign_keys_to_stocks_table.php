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
        Schema::table('stocks', function (Blueprint $table) {
            $table->foreign(['variant_id'], 'fk_product_variants_stock')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['warehouse_id'], 'fk_stocks_warehouse')->references(['id'])->on('warehouses')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table) {
            $table->dropForeign('fk_product_variants_stock');
            $table->dropForeign('fk_stocks_warehouse');
        });
    }
};

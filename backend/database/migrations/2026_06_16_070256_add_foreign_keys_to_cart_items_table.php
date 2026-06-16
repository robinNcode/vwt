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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreign(['product_id'], 'fk_cart_items_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['service_id'], 'fk_cart_items_service')->references(['id'])->on('services')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['cart_id'], 'fk_carts_items')->references(['id'])->on('carts')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign('fk_cart_items_product');
            $table->dropForeign('fk_cart_items_service');
            $table->dropForeign('fk_carts_items');
        });
    }
};

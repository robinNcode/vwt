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
        Schema::create('order_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id')->index('idx_order_items_order_id');
            $table->unsignedBigInteger('variant_id')->nullable()->index('idx_order_items_variant_id');
            $table->string('product_name_bn', 300);
            $table->string('product_name_en', 300);
            $table->string('sku', 100);
            $table->string('variant_label', 300)->nullable();
            $table->decimal('unit_price', 15);
            $table->bigInteger('quantity');
            $table->decimal('discount_amount', 15)->default(0);
            $table->decimal('line_total', 15);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

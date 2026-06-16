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
        Schema::create('product_prices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('variant_id')->index('idx_product_prices_variant_id');
            $table->unsignedBigInteger('currency_id')->default(1)->index('fk_product_prices_currency');
            $table->decimal('base_price', 15);
            $table->decimal('sale_price', 15)->nullable();
            $table->decimal('cost_price', 15)->nullable();
            $table->dateTime('sale_starts_at', 3)->nullable();
            $table->dateTime('sale_ends_at', 3)->nullable();
            $table->boolean('is_active')->default(true);

            $table->unique(['variant_id', 'currency_id'], 'uq_variant_currency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_prices');
    }
};

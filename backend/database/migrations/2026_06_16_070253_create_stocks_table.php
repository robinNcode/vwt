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
        Schema::create('stocks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('variant_id')->index('idx_stocks_variant_id');
            $table->unsignedBigInteger('warehouse_id')->index('fk_stocks_warehouse');
            $table->bigInteger('quantity')->default(0);
            $table->bigInteger('reserved')->default(0);
            $table->dateTime('updated_at', 3)->nullable();

            $table->unique(['variant_id', 'warehouse_id'], 'uq_stock_variant_wh');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};

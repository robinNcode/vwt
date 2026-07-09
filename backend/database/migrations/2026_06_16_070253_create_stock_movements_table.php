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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('variant_id')->index('idx_stock_movements_variant_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->string('movement_type', 20);
            $table->bigInteger('quantity');
            $table->string('reference_type', 50)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable()->index('idx_stock_movements_reference_id');
            $table->text('note')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('created_at', 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};

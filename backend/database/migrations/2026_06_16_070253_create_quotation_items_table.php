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
        Schema::create('quotation_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('quotation_id')->index('idx_quotation_items_quotation_id');
            $table->unsignedBigInteger('variant_id')->nullable();
            $table->string('product_name_en', 300);
            $table->string('sku', 100);
            $table->decimal('unit_price', 15);
            $table->bigInteger('quantity')->default(1);
            $table->decimal('line_total', 15);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
    }
};

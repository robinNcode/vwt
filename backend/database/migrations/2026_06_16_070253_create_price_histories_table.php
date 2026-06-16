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
        Schema::create('price_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('variant_id')->index('idx_price_histories_variant_id');
            $table->unsignedBigInteger('currency_id');
            $table->decimal('old_price', 15);
            $table->decimal('new_price', 15);
            $table->unsignedBigInteger('changed_by')->nullable();
            $table->dateTime('changed_at', 3);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};

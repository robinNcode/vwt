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
        Schema::create('quotations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('quotation_number', 50)->unique('idx_quotations_quotation_number');
            $table->unsignedBigInteger('customer_id')->nullable()->index('idx_quotations_customer_id');
            $table->string('session_token')->nullable()->index('idx_quotations_session_token');
            $table->string('customer_name', 200)->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone', 30)->nullable();
            $table->text('customer_address')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('draft');
            $table->dateTime('expires_at', 3)->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};

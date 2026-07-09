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
        Schema::create('accounting_service_revenues', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->decimal('amount', 15);
            $table->unsignedBigInteger('service_id')->nullable()->index('idx_accounting_service_revenues_service_id');
            $table->dateTime('date', 3);
            $table->string('reference')->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_accounting_service_revenues_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_service_revenues');
    }
};

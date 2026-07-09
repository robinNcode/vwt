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
        Schema::create('invoices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id')->nullable()->unique('idx_invoices_order_id');
            $table->string('invoice_number', 50)->unique('idx_invoices_invoice_number');
            $table->dateTime('issued_at', 3);
            $table->dateTime('due_date', 3)->nullable();
            $table->text('notes')->nullable();
            $table->json('template_config')->nullable();
            $table->string('pdf_url', 500)->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_invoices_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

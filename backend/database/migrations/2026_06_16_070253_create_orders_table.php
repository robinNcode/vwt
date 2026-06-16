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
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_number', 50)->unique('idx_orders_order_number');
            $table->unsignedBigInteger('customer_id')->nullable()->index('idx_orders_customer_id');
            $table->string('customer_name', 200);
            $table->string('customer_email');
            $table->string('customer_phone', 30);
            $table->string('ship_address_line1');
            $table->string('ship_address_line2')->nullable();
            $table->string('ship_city', 100);
            $table->string('ship_district', 100)->nullable();
            $table->string('ship_postal_code', 20)->nullable();
            $table->string('ship_country', 2)->default('BD');
            $table->string('bill_address_line1')->nullable();
            $table->string('bill_address_line2')->nullable();
            $table->string('bill_city', 100)->nullable();
            $table->string('bill_country', 2)->nullable()->default('BD');
            $table->string('currency_code', 3)->default('BDT');
            $table->decimal('subtotal', 15);
            $table->decimal('discount_amount', 15)->default(0);
            $table->decimal('shipping_fee', 15)->default(0);
            $table->decimal('tax_amount', 15)->default(0);
            $table->decimal('grand_total', 15);
            $table->string('status', 20)->default('pending')->index('idx_orders_status');
            $table->string('payment_status', 20)->default('unpaid');
            $table->string('payment_method', 100)->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_orders_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

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
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('category_id')->index('idx_products_category_id');
            $table->string('product_type', 20)->default('accessory');
            $table->string('sku_prefix', 50)->nullable();
            $table->string('name_bn', 300);
            $table->string('name_en', 300);
            $table->string('slug', 320)->unique('idx_products_slug');
            $table->string('sku', 100)->nullable()->unique('idx_products_sku');
            $table->double('price')->default(0);
            $table->bigInteger('stock')->default(0);
            $table->text('short_desc_bn')->nullable();
            $table->text('short_desc_en')->nullable();
            $table->longText('description_bn')->nullable();
            $table->longText('description_en')->nullable();
            $table->string('brand', 150)->nullable();
            $table->string('model_number', 150)->nullable();
            $table->string('manufacturer', 200)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('meta_title_bn')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_desc_bn')->nullable();
            $table->text('meta_desc_en')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_products_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

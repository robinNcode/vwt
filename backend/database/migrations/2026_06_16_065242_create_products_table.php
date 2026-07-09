<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('product_categories')->onDelete('restrict');
            $table->string('product_type', 50)->default('pneumatic_component');
            $table->string('sku_prefix', 50)->nullable();
            $table->string('name_bn')->nullable();
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->decimal('price', 15, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->text('short_desc_bn')->nullable();
            $table->text('short_desc_en')->nullable();
            $table->longText('description_bn')->nullable();
            $table->longText('description_en')->nullable();
            $table->string('brand')->nullable();
            $table->string('model_number')->nullable();
            $table->string('manufacturer')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('meta_title_bn')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_desc_bn')->nullable();
            $table->text('meta_desc_en')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

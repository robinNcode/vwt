<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds thumbnail_url columns to product_images and services tables
 * to store pre-generated thumbnail paths for faster page loads.
 */
return new class extends Migration
{
    public function up(): void
    {
        // product_images: add thumbnail_url after url
        if (!Schema::hasColumn('product_images', 'thumbnail_url')) {
            Schema::table('product_images', function (Blueprint $table) {
                $table->string('thumbnail_url', 500)->nullable()->after('url');
            });
        }

        // services: add thumbnail_url after image_url
        if (!Schema::hasColumn('services', 'thumbnail_url')) {
            Schema::table('services', function (Blueprint $table) {
                $table->string('thumbnail_url', 500)->nullable()->after('image_url');
            });
        }
    }

    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumn('thumbnail_url');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('thumbnail_url');
        });
    }
};

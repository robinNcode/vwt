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
        Schema::table('attribute_options', function (Blueprint $table) {
            $table->foreign(['attribute_id'], 'fk_attributes_options')->references(['id'])->on('attributes')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attribute_options', function (Blueprint $table) {
            $table->dropForeign('fk_attributes_options');
        });
    }
};

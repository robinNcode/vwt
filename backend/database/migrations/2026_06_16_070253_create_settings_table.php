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
        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('group', 100)->default('general');
            $table->string('key', 150);
            $table->text('value')->nullable();
            $table->json('value_json')->nullable();
            $table->string('label_bn')->nullable();
            $table->string('label_en')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->dateTime('updated_at', 3)->nullable();

            $table->unique(['group', 'key'], 'uq_settings_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

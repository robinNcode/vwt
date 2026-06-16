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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('admin_id')->nullable()->index('idx_audit_logs_admin_id');
            $table->string('entity_type', 100);
            $table->unsignedBigInteger('entity_id');
            $table->string('action', 20);
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->dateTime('created_at', 3)->nullable()->index('idx_audit_logs_created_at');

            $table->index(['entity_type', 'entity_id'], 'idx_audit_entity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};

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
        Schema::table('role_permission_map', function (Blueprint $table) {
            $table->foreign(['permission_id'], 'fk_role_permission_map_permission')->references(['id'])->on('permissions')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['role_id'], 'fk_role_permission_map_role')->references(['id'])->on('roles')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('role_permission_map', function (Blueprint $table) {
            $table->dropForeign('fk_role_permission_map_permission');
            $table->dropForeign('fk_role_permission_map_role');
        });
    }
};

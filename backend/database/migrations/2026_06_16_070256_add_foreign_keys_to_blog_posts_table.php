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
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreign(['author_id'], 'fk_blog_posts_author')->references(['id'])->on('users')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['category_id'], 'fk_blog_posts_category')->references(['id'])->on('blog_categories')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropForeign('fk_blog_posts_author');
            $table->dropForeign('fk_blog_posts_category');
        });
    }
};

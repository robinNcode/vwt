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
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('category_id')->nullable()->index('idx_blog_posts_category_id');
            $table->string('slug', 320)->unique('idx_blog_posts_slug');
            $table->string('title_bn');
            $table->string('title_en');
            $table->text('excerpt_bn')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->longText('content_bn')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('cover_image', 500)->nullable();
            $table->string('status', 20)->default('draft')->index('idx_blog_posts_status');
            $table->string('meta_title_bn')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_desc_bn')->nullable();
            $table->text('meta_desc_en')->nullable();
            $table->unsignedBigInteger('author_id')->nullable()->index('idx_blog_posts_author_id');
            $table->dateTime('published_at', 3)->nullable();
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->dateTime('deleted_at', 3)->nullable()->index('idx_blog_posts_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};

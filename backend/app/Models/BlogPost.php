<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'slug',
        'title_bn',
        'title_en',
        'excerpt_bn',
        'excerpt_en',
        'content_bn',
        'content_en',
        'cover_image',
        'status',
        'meta_title_bn',
        'meta_title_en',
        'meta_desc_bn',
        'meta_desc_en',
        'author_id',
        'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}

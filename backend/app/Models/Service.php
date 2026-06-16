<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title_bn',
        'title_en',
        'slug',
        'short_desc_bn',
        'short_desc_en',
        'description_bn',
        'description_en',
        'base_price',
        'image_url',
        'is_active',
        'meta_title_bn',
        'meta_title_en',
        'meta_desc_bn',
        'meta_desc_en',
        'created_by'
    ];
}

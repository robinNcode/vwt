<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ProductImage;
use App\Models\ProductCategory;
use App\Models\ProductVariant;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'product_type',
        'sku_prefix',
        'name_bn',
        'name_en',
        'slug',
        'sku',
        'price',
        'stock',
        'short_desc_bn',
        'short_desc_en',
        'description_bn',
        'description_en',
        'brand',
        'model_number',
        'manufacturer',
        'is_featured',
        'is_active',
        'meta_title_bn',
        'meta_title_en',
        'meta_desc_bn',
        'meta_desc_en',
        'created_by',
        'updated_by',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }
}

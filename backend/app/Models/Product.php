<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ProductImage;
use App\Models\ProductCategory;
use App\Models\ProductVariant;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'stock_quantity',
        'description',
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

    protected static function booted(): void
    {
        static::saving(function ($product) {
            // Keep legacy / non-nullable columns synchronized
            if (empty($product->name)) {
                $product->name = $product->name_en ?? $product->name_bn ?? '';
            }
            if (!isset($product->stock_quantity)) {
                $product->stock_quantity = (int) ($product->stock ?? 0);
            }
            if (empty($product->description)) {
                $product->description = $product->short_desc_en ?? $product->description_en ?? '';
            }
        });
    }

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

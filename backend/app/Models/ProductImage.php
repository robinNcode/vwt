<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    public $timestamps = false;

    protected $fillable = ['product_id', 'url', 'alt_bn', 'alt_en', 'is_primary', 'sort_order', 'thumbnail_url'];

    protected $appends = ['thumb'];

    /**
     * Return the thumbnail URL if stored, otherwise fall back to the original.
     * The 'thumbnail_url' column is optional — we store it only when GD generates one.
     */
    public function getThumbAttribute(): string
    {
        // If a dedicated thumbnail_url column exists on the row, use it.
        // Fall back to original url.
        return $this->attributes['thumbnail_url'] ?? $this->attributes['url'] ?? '';
    }
}

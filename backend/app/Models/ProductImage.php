<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    public $timestamps = false;
    protected $fillable = ['product_id', 'url', 'alt_bn', 'alt_en', 'is_primary', 'sort_order'];
}

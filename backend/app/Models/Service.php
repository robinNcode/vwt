<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A service offering shown on the storefront.
 */
class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name_bn',
        'name_en',
        'slug',
        'description_bn',
        'description_en',
        'price',
        'image_url',
        'is_active',
        'sort_order',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];
}

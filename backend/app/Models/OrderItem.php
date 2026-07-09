<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'variant_id',
        'product_name_bn',
        'product_name_en',
        'sku',
        'variant_label',
        'unit_price',
        'quantity',
        'discount_amount',
        'line_total'
    ];
}

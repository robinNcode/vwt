<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'quotation_id',
        'variant_id',
        'product_name_en',
        'sku',
        'unit_price',
        'quantity',
        'line_total',
    ];
}

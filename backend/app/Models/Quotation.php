<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'quotation_number',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'company_name',
        'valid_until',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'grand_total',
        'status',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'valid_until' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'ship_address_line1',
        'ship_address_line2',
        'ship_city',
        'ship_district',
        'ship_postal_code',
        'ship_country',
        'bill_address_line1',
        'bill_address_line2',
        'bill_city',
        'bill_country',
        'currency_code',
        'subtotal',
        'discount_amount',
        'shipping_fee',
        'tax_amount',
        'grand_total',
        'status',
        'payment_status',
        'payment_method',
        'payment_reference',
        'notes',
        'created_by'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}

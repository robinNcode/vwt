<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A customer order with its shipping, billing, and payment details.
 */
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

    /**
     * Line items belonging to this order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    /**
     * Status-change history entries for this order.
     */
    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    /**
     * The customer who placed this order, if any.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}

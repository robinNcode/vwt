<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A single product or service line within a cart.
 */
class CartItem extends Model
{
    use SoftDeletes;

    protected $fillable = ['cart_id', 'product_id', 'service_id', 'quantity'];

    /**
     * The product this line refers to, if any.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * The service this line refers to, if any.
     */
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}

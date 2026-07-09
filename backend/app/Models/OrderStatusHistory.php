<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A record of a single status transition on an order.
 */
class OrderStatusHistory extends Model
{
    protected $table = 'order_status_histories';

    // Uses a changed_at column instead of created_at/updated_at.
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'old_status',
        'new_status',
        'note',
        'changed_by',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];
}

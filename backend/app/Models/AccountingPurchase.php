<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingPurchase extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'vendor',
        'date',
        'reference'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}

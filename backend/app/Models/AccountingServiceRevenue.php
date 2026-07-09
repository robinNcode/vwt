<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingServiceRevenue extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'service_id',
        'date',
        'reference',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}

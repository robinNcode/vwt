<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingSale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'date',
        'reference'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}

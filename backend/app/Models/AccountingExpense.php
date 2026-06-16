<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingExpense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'category',
        'description',
        'date'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'invoice_number',
        'issued_at',
        'due_date',
        'notes',
        'template_config',
        'pdf_url',
        'created_by'
    ];

    protected $casts = [
        'template_config' => 'array',
        'issued_at' => 'datetime',
        'due_date' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}

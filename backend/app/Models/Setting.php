<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    // settings table has only updated_at (no created_at).
    const CREATED_AT = null;
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'group',
        'key',
        'value',
        'value_json',
        'label_bn',
        'label_en',
        'updated_by',
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];
}

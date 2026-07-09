<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    // permissions table has only created_at (no updated_at).
    const UPDATED_AT = null;

    protected $fillable = [
        'name',
        'slug',
        'module',
    ];
}

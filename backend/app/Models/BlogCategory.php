<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name_bn',
        'name_en',
        'slug',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A user role that groups a set of permissions.
 */
class Role extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Permissions granted to this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permission_map',
            'role_id',
            'permission_id'
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * List all roles with their assigned permissions.
     */
    public function index()
    {
        return ApiResponse::ok('Roles fetched successfully', Role::with('permissions')->get());
    }

    /**
     * Create a role.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string',
        ]);

        return ApiResponse::created('Role created successfully', Role::create($data));
    }

    /**
     * List all available permissions.
     */
    public function listPermissions()
    {
        return ApiResponse::ok('Permissions fetched successfully', Permission::all());
    }

    /**
     * Sync the given permission ids onto a role.
     */
    public function updatePermissions(Request $request, $id)
    {
        $data = $request->validate([
            'permission_ids' => 'present|array',
            'permission_ids.*' => 'integer',
        ]);

        $role = Role::find($id);
        if (! $role) {
            return ApiResponse::fail('Failed to update permissions', 500);
        }

        $role->permissions()->sync($data['permission_ids']);

        return ApiResponse::ok('Permissions updated successfully');
    }
}

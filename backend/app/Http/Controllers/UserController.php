<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * List all users with their role.
     */
    public function index()
    {
        return ApiResponse::ok('Users fetched successfully', User::with('role')->get());
    }

    /**
     * Return the authenticated user's profile with role and permissions.
     */
    public function getProfile(Request $request)
    {
        $user = User::with('role.permissions')->find($request->user()->id);

        return ApiResponse::ok('Profile fetched successfully', $user);
    }

    /**
     * Update the authenticated user's own name, email, or password.
     */
    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'password' => 'nullable|string',
        ]);

        $user = User::findOrFail($request->user()->id);
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }
        if (! empty($data['password'])) {
            $user->password = $data['password']; // hashed via model cast
        }
        $user->save();

        return ApiResponse::ok('Profile updated successfully', $user);
    }

    /**
     * Admin update of a user's name, email, role, active flag, or password.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (! $user) {
            return ApiResponse::fail('User not found', 404);
        }

        $data = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'password' => 'nullable|string',
            'role_id' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }
        if (isset($data['role_id'])) {
            $user->role_id = $data['role_id'];
        }
        if (isset($data['is_active'])) {
            $user->is_active = $data['is_active'];
        }
        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }
        $user->save();

        return ApiResponse::ok('User updated successfully', $user);
    }

    /**
     * Upload and set the authenticated user's avatar image.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|file|image',
        ]);

        $user = User::findOrFail($request->user()->id);

        $file = $request->file('avatar');
        $filename = 'avatar_'.$user->id.'_'.time().'_'.$file->getClientOriginalName();
        $file->move(public_path('uploads/avatars'), $filename);

        $user->avatar_url = '/uploads/avatars/'.$filename;
        $user->save();

        return ApiResponse::ok('Avatar updated successfully', $user);
    }
}

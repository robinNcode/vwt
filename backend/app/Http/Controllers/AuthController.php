<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Unified login. `type: "customer"` routes to the customer guard,
     * anything else authenticates an admin User. Mirrors the Go AuthHandler.
     */
    public function adminLogin(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'type' => 'nullable|string',
        ]);

        $email = strtolower(trim($data['email']));

        if (isset($data['type']) && strtolower(trim($data['type'])) === 'customer') {
            return $this->customerLogin($email, $data['password']);
        }

        $user = User::where('email', $email)->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return ApiResponse::fail('Invalid credentials', 401);
        }
        if (! $user->is_active) {
            return ApiResponse::fail('Account disabled', 403);
        }

        $token = auth('api')->login($user);

        return ApiResponse::ok('Login successful', [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'type' => 'admin',
            ],
        ]);
    }

    protected function customerLogin(string $email, string $password)
    {
        $customer = Customer::where('email', $email)->first();
        if (! $customer || ! Hash::check($password, $customer->password)) {
            return ApiResponse::fail('Invalid credentials', 401);
        }
        if (! $customer->is_active) {
            return ApiResponse::fail('Account disabled', 403);
        }

        $token = auth('customer-api')->login($customer);

        return ApiResponse::ok('Login successful', [
            'token' => $token,
            'user' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'type' => 'customer',
            ],
        ]);
    }

    public function customerRegister(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        $customer = Customer::create([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'is_active' => true,
        ]);

        $token = auth('customer-api')->login($customer);

        return ApiResponse::created('Registration successful', [
            'token' => $token,
            'user' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'type' => 'customer',
            ],
        ]);
    }
}

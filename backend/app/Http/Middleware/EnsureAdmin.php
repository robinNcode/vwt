<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;

/**
 * Mirrors the Go RequireAdmin middleware: allow role_id == 1 (super admin)
 * or a token whose "type" claim is "admin". Runs after the `auth:api` guard,
 * so an authenticated admin User is already resolved on the `api` guard.
 */
class EnsureAdmin
{
    /**
     * Allow the request through only for super admins or admin-typed tokens.
     */
    public function handle(Request $request, Closure $next)
    {
        $guard = auth('api');
        $user = $guard->user();

        if (! $user) {
            return ApiResponse::fail('Forbidden', 403);
        }

        $type = null;
        try {
            $type = $guard->payload()->get('type');
        } catch (\Throwable $e) {
            $type = null;
        }

        if ($type === 'admin' || (int) ($user->role_id ?? 0) === 1) {
            return $next($request);
        }

        return ApiResponse::fail('Forbidden', 403);
    }
}

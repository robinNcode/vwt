<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Standard API envelope matching the Go backend response shape:
 * { "success": bool, "message": string, "data": mixed, "errors": mixed }
 */
class ApiResponse
{
    public static function ok(string $message = '', $data = null, int $status = 200): JsonResponse
    {
        $payload = ['success' => true];
        if ($message !== '') {
            $payload['message'] = $message;
        }
        if ($data !== null) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $status);
    }

    public static function created(string $message = '', $data = null): JsonResponse
    {
        return self::ok($message, $data, 201);
    }

    public static function fail(string $message, int $status = 400, $errors = null): JsonResponse
    {
        $payload = ['success' => false, 'message' => $message];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}

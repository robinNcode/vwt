<?php

namespace App\Http\Controllers;

use App\Support\ApiResponse;
use Illuminate\Http\Request;

/**
 * Web settings are stored as a single JSON document on disk, mirroring the Go
 * file-backed WebSettingService (storage/app/web_settings.json).
 */
class WebSettingController extends Controller
{
    /**
     * Absolute path of the JSON file backing the web settings.
     */
    protected function filePath(): string
    {
        return storage_path('app/web_settings.json');
    }

    /**
     * Return the stored web settings, or defaults when none exist yet.
     */
    public function show()
    {
        $path = $this->filePath();
        if (! is_file($path)) {
            return ApiResponse::ok('Web settings fetched successfully', ['site_name' => 'Volt Wave Tech']);
        }

        $settings = json_decode(file_get_contents($path), true) ?: ['site_name' => 'Volt Wave Tech'];

        return ApiResponse::ok('Web settings fetched successfully', $settings);
    }

    /**
     * Overwrite the web settings JSON file with the request payload.
     */
    public function update(Request $request)
    {
        $settings = $request->all();

        $dir = dirname($this->filePath());
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($this->filePath(), json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return ApiResponse::ok('Web settings updated successfully', $settings);
    }
}

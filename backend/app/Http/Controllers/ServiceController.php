<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    /** Cache TTL in seconds (30 minutes) */
    private const CACHE_KEY = 'services.public';
    private const CACHE_TTL = 1800;

    /**
     * List all active services, cached for public use.
     */
    public function index(Request $request)
    {
        // Admin route (auth:api + admin middleware) bypasses cache
        if ($request->is('api/v1/admin/*')) {
            $services = Service::orderByDesc('id')->get();
        } else {
            $services = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
                return Service::where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->get();
            });
        }

        return ApiResponse::ok('Services fetched successfully', $services);
    }

    /**
     * Create a service.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en'       => 'required|string',
            'name_bn'       => 'required|string',
            'slug'          => 'required|string|unique:services,slug',
            'description_bn'=> 'nullable|string',
            'description_en'=> 'nullable|string',
            'price'         => 'nullable|numeric',
            'image_url'     => 'nullable|string',
            'thumbnail_url' => 'nullable|string',
            'image'         => 'nullable|file|mimes:jpeg,jpg,png,webp,gif|max:8192',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $imgData = $this->handleImageUpload($request->file('image'));
            $data['image_url'] = $imgData['image_url'];
            $data['thumbnail_url'] = $imgData['thumbnail_url'];
        }

        $service = Service::create($data);
        Cache::forget(self::CACHE_KEY);

        return ApiResponse::created('Service created successfully', $service);
    }

    /**
     * Update an existing service.
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $fields = $request->only([
            'name_en', 'name_bn', 'slug', 'description_bn', 'description_en',
            'price', 'image_url', 'thumbnail_url', 'is_active', 'sort_order',
        ]);

        if ($request->hasFile('image')) {
            $imgData = $this->handleImageUpload($request->file('image'));
            $fields['image_url'] = $imgData['image_url'];
            $fields['thumbnail_url'] = $imgData['thumbnail_url'];
        }

        $service->update($fields);
        Cache::forget(self::CACHE_KEY);

        return ApiResponse::ok('Service updated successfully', $service);
    }

    private function handleImageUpload($file): array
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = \Illuminate\Support\Str::uuid() . '.' . $ext;
        $path = "uploads/services/{$filename}";
        \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
        $originalUrl = "/storage/{$path}";

        $thumbUrl = null;
        if (extension_loaded('gd')) {
            try {
                $thumbName = 'thumb_' . $filename;
                $thumbRelPath = "uploads/services/{$thumbName}";
                $fullThumbDir = storage_path('app/public/uploads/services');

                if (!is_dir($fullThumbDir)) {
                    mkdir($fullThumbDir, 0755, true);
                }

                $src = match ($ext) {
                    'jpg', 'jpeg' => imagecreatefromjpeg($file->getRealPath()),
                    'png'         => imagecreatefrompng($file->getRealPath()),
                    'webp'        => imagecreatefromwebp($file->getRealPath()),
                    default       => null,
                };

                if ($src) {
                    $origW = imagesx($src);
                    $origH = imagesy($src);
                    $maxDim = 400;

                    if ($origW > $origH) {
                        $newW = $maxDim;
                        $newH = (int) round(($origH / $origW) * $maxDim);
                    } else {
                        $newH = $maxDim;
                        $newW = (int) round(($origW / $origH) * $maxDim);
                    }

                    $thumb = imagecreatetruecolor($newW, $newH);
                    if ($ext === 'png') {
                        imagealphablending($thumb, false);
                        imagesavealpha($thumb, true);
                    }

                    imagecopyresampled($thumb, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
                    $destPath = "{$fullThumbDir}/{$thumbName}";

                    match ($ext) {
                        'jpg', 'jpeg' => imagejpeg($thumb, $destPath, 82),
                        'png'         => imagepng($thumb, $destPath, 7),
                        'webp'        => imagewebp($thumb, $destPath, 82),
                        default       => null,
                    };

                    imagedestroy($src);
                    imagedestroy($thumb);

                    $thumbUrl = "/storage/{$thumbRelPath}";
                }
            } catch (\Throwable $e) {}
        }

        return [
            'image_url'     => $originalUrl,
            'thumbnail_url' => $thumbUrl ?? $originalUrl,
        ];
    }

    /**
     * Delete a service.
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        Cache::forget(self::CACHE_KEY);

        return ApiResponse::ok('Service deleted successfully');
    }
}

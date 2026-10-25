<?php

namespace App\Http\Controllers;

use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Handles image uploads for products and services.
 * Stores originals in storage/app/public/uploads/{type}/
 * and generates thumbnails if the GD extension is available.
 */
class ImageUploadController extends Controller
{
    /**
     * Upload an image and return both original and thumbnail URLs.
     *
     * POST /api/v1/admin/upload
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file'  => 'required|file|mimes:jpeg,jpg,png,webp,gif|max:8192',
            'type'  => 'nullable|string|in:products,services,banners,general',
        ]);

        $type = $request->input('type', 'general');
        $file = $request->file('file');

        // Generate a unique filename keeping the original extension
        $ext      = strtolower($file->getClientOriginalExtension());
        $filename = Str::uuid() . '.' . $ext;

        // Store original file under storage/app/public/uploads/{type}/
        $path = "uploads/{$type}/{$filename}";
        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        $originalUrl = "/storage/{$path}";

        // Attempt to generate a thumbnail (requires GD)
        $thumbUrl = $this->generateThumbnail($file->getRealPath(), $type, $filename, $ext);

        return ApiResponse::ok('Image uploaded successfully', [
            'url'           => $originalUrl,
            'thumbnail_url' => $thumbUrl ?? $originalUrl,
            'filename'      => $filename,
        ]);
    }

    /**
     * Generate a 400×400 thumbnail using PHP GD if available.
     * Returns the relative URL on success, null on failure.
     */
    private function generateThumbnail(string $srcPath, string $type, string $filename, string $ext): ?string
    {
        if (!extension_loaded('gd')) {
            return null;
        }

        $thumbW = 400;
        $thumbH = 400;

        try {
            // Load source image
            $src = match ($ext) {
                'jpg', 'jpeg' => imagecreatefromjpeg($srcPath),
                'png'         => imagecreatefrompng($srcPath),
                'webp'        => imagecreatefromwebp($srcPath),
                'gif'         => imagecreatefromgif($srcPath),
                default       => null,
            };

            if (!$src) {
                return null;
            }

            [$w, $h] = getimagesize($srcPath);

            // Scale maintaining aspect ratio, crop center
            $scale  = max($thumbW / $w, $thumbH / $h);
            $scaledW = (int) round($w * $scale);
            $scaledH = (int) round($h * $scale);
            $offsetX = (int) round(($scaledW - $thumbW) / 2);
            $offsetY = (int) round(($scaledH - $thumbH) / 2);

            $thumb = imagecreatetruecolor($thumbW, $thumbH);

            // Preserve transparency for PNG
            if (in_array($ext, ['png', 'gif'])) {
                imagealphablending($thumb, false);
                imagesavealpha($thumb, true);
                $transparent = imagecolorallocatealpha($thumb, 0, 0, 0, 127);
                imagefilledrectangle($thumb, 0, 0, $thumbW, $thumbH, $transparent);
            }

            imagecopyresampled($thumb, $src, 0, 0, (int) round($offsetX / $scale), (int) round($offsetY / $scale), $thumbW, $thumbH, (int) round($thumbW / $scale), (int) round($thumbH / $scale));

            $thumbFilename = 'thumb_' . $filename;
            $thumbPath     = "uploads/{$type}/thumbs/{$thumbFilename}";
            $thumbDiskPath = storage_path("app/public/{$thumbPath}");

            // Ensure thumbs directory exists
            @mkdir(dirname($thumbDiskPath), 0755, true);

            $saved = match ($ext) {
                'jpg', 'jpeg' => imagejpeg($thumb, $thumbDiskPath, 85),
                'png'         => imagepng($thumb, $thumbDiskPath, 7),
                'webp'        => imagewebp($thumb, $thumbDiskPath, 85),
                'gif'         => imagegif($thumb, $thumbDiskPath),
                default       => false,
            };

            imagedestroy($src);
            imagedestroy($thumb);

            return $saved ? "/storage/{$thumbPath}" : null;

        } catch (\Throwable $e) {
            return null;
        }
    }
}

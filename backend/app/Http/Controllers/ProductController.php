<?php

namespace App\Http\Controllers;

use App\DTOs\ProductDTO;
use App\Http\Requests\StoreProductRequest;
use App\Services\ProductService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * List active products for the public storefront.
     */
    public function listPublic(Request $request)
    {
        return ApiResponse::ok('Products fetched successfully', $this->productService->getPublicProducts());
    }

    /**
     * List all products for admin management.
     */
    public function index(Request $request)
    {
        return ApiResponse::ok('Products fetched successfully', $this->productService->getAdminProducts());
    }

    /**
     * Create a product from the validated request payload.
     */
    public function store(StoreProductRequest $request)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->createProduct($dto);

        // If an image file was uploaded, store it and create a ProductImage record
        $this->handleUploadedImage($request, $product);

        return ApiResponse::created('Product created successfully', $product->load('images'));
    }

    /**
     * Update an existing product from the validated request payload.
     */
    public function update(StoreProductRequest $request, $id)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->updateProduct($id, $dto);

        // If an image file was uploaded, store it and update/create ProductImage
        $this->handleUploadedImage($request, $product);

        return ApiResponse::ok('Product updated successfully', $product->load('images'));
    }

    private function handleUploadedImage(Request $request, $product): void
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $ext = strtolower($file->getClientOriginalExtension());
            $filename = \Illuminate\Support\Str::uuid() . '.' . $ext;
            $path = "uploads/products/{$filename}";
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
            $originalUrl = "/storage/{$path}";

            // Auto-generate thumbnail if possible
            $thumbUrl = $this->createThumbnail($file->getRealPath(), $filename, $ext);

            // Set all existing images to is_primary = false
            \App\Models\ProductImage::where('product_id', $product->id)->update(['is_primary' => false]);

            \App\Models\ProductImage::create([
                'product_id'    => $product->id,
                'url'           => $originalUrl,
                'thumbnail_url' => $thumbUrl ?? $originalUrl,
                'alt_en'        => $product->name_en,
                'alt_bn'        => $product->name_bn,
                'is_primary'    => true,
                'sort_order'    => 0,
            ]);

            \Illuminate\Support\Facades\Cache::forget('products.public');
        }
    }

    private function createThumbnail(string $srcPath, string $filename, string $ext): ?string
    {
        if (!extension_loaded('gd')) {
            return null;
        }

        try {
            $thumbName = 'thumb_' . $filename;
            $thumbRelPath = "uploads/products/{$thumbName}";
            $fullThumbDir = storage_path('app/public/uploads/products');

            if (!is_dir($fullThumbDir)) {
                mkdir($fullThumbDir, 0755, true);
            }

            $src = match ($ext) {
                'jpg', 'jpeg' => imagecreatefromjpeg($srcPath),
                'png'         => imagecreatefrompng($srcPath),
                'webp'        => imagecreatefromwebp($srcPath),
                default       => null,
            };

            if (!$src) {
                return null;
            }

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

            return "/storage/{$thumbRelPath}";
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Delete a product.
     */
    public function destroy($id)
    {
        $this->productService->deleteProduct($id);

        return ApiResponse::ok('Product deleted successfully');
    }
}

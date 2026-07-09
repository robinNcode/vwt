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

        return ApiResponse::created('Product created successfully', $product);
    }

    /**
     * Update an existing product from the validated request payload.
     */
    public function update(StoreProductRequest $request, $id)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->updateProduct($id, $dto);

        return ApiResponse::ok('Product updated successfully', $product);
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

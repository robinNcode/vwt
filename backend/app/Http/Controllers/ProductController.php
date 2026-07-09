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

    public function listPublic(Request $request)
    {
        return ApiResponse::ok('Products fetched successfully', $this->productService->getPublicProducts());
    }

    public function index(Request $request)
    {
        return ApiResponse::ok('Products fetched successfully', $this->productService->getAdminProducts());
    }

    public function store(StoreProductRequest $request)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->createProduct($dto);

        return ApiResponse::created('Product created successfully', $product);
    }

    public function update(StoreProductRequest $request, $id)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->updateProduct($id, $dto);

        return ApiResponse::ok('Product updated successfully', $product);
    }

    public function destroy($id)
    {
        $this->productService->deleteProduct($id);

        return ApiResponse::ok('Product deleted successfully');
    }
}

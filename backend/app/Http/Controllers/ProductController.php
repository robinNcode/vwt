<?php

namespace App\Http\Controllers;

use App\DTOs\ProductDTO;
use App\Http\Requests\StoreProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function listPublic(Request $request)
    {
        $products = $this->productService->getPublicProducts();
        return response()->json(['data' => $products]);
    }

    public function index(Request $request)
    {
        $products = $this->productService->getAdminProducts();
        return response()->json(['data' => $products]);
    }

    public function store(StoreProductRequest $request)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->createProduct($dto);
        
        return response()->json(['data' => $product, 'message' => 'Product created successfully'], 201);
    }

    public function update(StoreProductRequest $request, $id)
    {
        $dto = ProductDTO::fromRequest($request->validated());
        $product = $this->productService->updateProduct($id, $dto);
        
        return response()->json(['data' => $product, 'message' => 'Product updated successfully']);
    }

    public function destroy($id)
    {
        $this->productService->deleteProduct($id);
        return response()->json(['message' => 'Product deleted successfully']);
    }
}

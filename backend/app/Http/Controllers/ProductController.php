<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function listPublic(Request $request)
    {
        $products = Product::where('is_active', true)->with('images')->paginate(10);
        return response()->json(['data' => $products]);
    }

    public function index(Request $request)
    {
        $products = Product::with('images')->paginate(10);
        return response()->json(['data' => $products]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'slug' => 'required|string|unique:products,slug',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'numeric',
            'is_active' => 'boolean'
        ]);

        $product = Product::create($validated);
        return response()->json(['data' => $product, 'message' => 'Product created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json(['data' => $product, 'message' => 'Product updated successfully']);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}

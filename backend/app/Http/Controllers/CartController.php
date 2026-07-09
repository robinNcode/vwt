<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Service;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Loads (or creates) the current principal's cart with its items and the
     * related product/service eager-loaded, matching the Go cart service.
     */
    protected function loadCart(int $userId): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $cart->load(['items.product', 'items.service']);

        return $cart;
    }

    public function getCart(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::ok('Cart fetched successfully', $this->loadCart($userId));
    }

    public function addItem(Request $request)
    {
        $userId = $request->user()->id;

        $data = $request->validate([
            'product_id' => 'nullable|integer',
            'service_id' => 'nullable|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $productId = $data['product_id'] ?? null;
        $serviceId = $data['service_id'] ?? null;

        if ($productId === null && $serviceId === null) {
            return ApiResponse::fail('Product ID or Service ID is required', 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $query = CartItem::where('cart_id', $cart->id);
        if ($productId !== null) {
            if (! Product::whereKey($productId)->exists()) {
                return ApiResponse::fail('Failed to add to cart', 500, 'product not found');
            }
            $query->where('product_id', $productId);
        } else {
            if (! Service::whereKey($serviceId)->exists()) {
                return ApiResponse::fail('Failed to add to cart', 500, 'service not found');
            }
            $query->where('service_id', $serviceId);
        }

        $existing = $query->first();
        if ($existing) {
            $existing->quantity += $data['quantity'];
            $existing->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'service_id' => $serviceId,
                'quantity' => $data['quantity'],
            ]);
        }

        return ApiResponse::ok('Item added to cart', $this->loadCart($userId));
    }

    public function updateQuantity(Request $request, $id)
    {
        $userId = $request->user()->id;

        $data = $request->validate([
            'quantity' => 'required|integer',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = CartItem::where('id', $id)->where('cart_id', $cart->id)->first();
        if (! $item) {
            return ApiResponse::fail('Failed to update item quantity', 500, 'cart item not found');
        }

        if ($data['quantity'] <= 0) {
            $item->delete();
        } else {
            $item->quantity = $data['quantity'];
            $item->save();
        }

        return ApiResponse::ok('Cart updated', $this->loadCart($userId));
    }

    public function removeItem(Request $request, $id)
    {
        $userId = $request->user()->id;

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        CartItem::where('id', $id)->where('cart_id', $cart->id)->delete();

        return ApiResponse::ok('Item removed from cart', $this->loadCart($userId));
    }

    public function clearCart(Request $request)
    {
        $userId = $request->user()->id;

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        CartItem::where('cart_id', $cart->id)->delete();

        return ApiResponse::ok('Cart cleared successfully');
    }
}

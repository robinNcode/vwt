<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product');

        return response()->json(['data' => $cart]);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'product_id' => $request->product_id],
            ['quantity' => \DB::raw('quantity + ' . $request->quantity)]
        );

        return response()->json(['data' => $cartItem, 'message' => 'Item added to cart']);
    }

    public function removeItem($itemId)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        if ($cart) {
            CartItem::where('cart_id', $cart->id)->where('id', $itemId)->delete();
        }
        return response()->json(['message' => 'Item removed']);
    }
}

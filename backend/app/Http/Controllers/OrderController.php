<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items')->paginate(15);
        return response()->json(['data' => $orders]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'ship_address_line1' => 'required|string',
            'ship_city' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();
        try {
            $subtotal = 0;
            foreach ($cart->items as $item) {
                // Assuming product price logic is implemented here
                $subtotal += ($item->product->price ?? 0) * $item->quantity;
            }

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'customer_id' => $user->id,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => $request->phone ?? '',
                'ship_address_line1' => $request->ship_address_line1,
                'ship_city' => $request->ship_city,
                'subtotal' => $subtotal,
                'grand_total' => $subtotal, // Tax/shipping logic omitted for brevity
                'status' => 'pending',
                'payment_method' => $request->payment_method,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name_bn' => $item->product->name_bn ?? '',
                    'product_name_en' => $item->product->name_en ?? '',
                    'sku' => $item->product->sku ?? '',
                    'unit_price' => $item->product->price ?? 0,
                    'quantity' => $item->quantity,
                    'line_total' => ($item->product->price ?? 0) * $item->quantity,
                ]);
            }

            // Clear cart
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return response()->json(['data' => $order->load('items'), 'message' => 'Checkout successful'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed: ' . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['data' => $order, 'message' => 'Order status updated']);
    }
}

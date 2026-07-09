<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // ─── Admin ────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $status = trim((string) $request->query('status', ''));

        $query = Order::query()->orderByDesc('id');
        if ($status !== '') {
            $query->where('status', $status);
        }

        return ApiResponse::ok('Orders fetched successfully', $query->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate(['status' => 'required|string']);
        $status = strtolower(trim($data['status']));

        $order = Order::find($id);
        if (! $order) {
            return ApiResponse::fail('Failed to update order', 500);
        }

        DB::transaction(function () use ($order, $status) {
            $old = $order->status;
            $order->status = $status;
            $order->save();

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'old_status' => $old,
                'new_status' => $status,
                'changed_at' => now(),
            ]);
        });

        return ApiResponse::ok('Order updated successfully', ['id' => (int) $id, 'status' => $status]);
    }

    // ─── Public ───────────────────────────────────────────────────────────

    public function getById($id)
    {
        $order = Order::with('items')->find($id);
        if (! $order) {
            return ApiResponse::fail('Order not found', 404);
        }

        return ApiResponse::ok('Order fetched successfully', $order);
    }

    public function trackByNumber($number)
    {
        $order = Order::with('items')->where('order_number', trim($number))->first();
        if (! $order) {
            return ApiResponse::fail('Order not found', 404);
        }

        return ApiResponse::ok('Order fetched successfully', $order);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'ship_address_line1' => 'required|string',
            'ship_address_line2' => 'nullable|string',
            'ship_city' => 'required|string',
            'ship_district' => 'nullable|string',
            'ship_postal_code' => 'nullable|string',
            'ship_country' => 'nullable|string',
            'currency_code' => 'nullable|string',
            'subtotal' => 'nullable|numeric',
            'grand_total' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'nullable|integer',
            'items.*.product_name_bn' => 'nullable|string',
            'items.*.product_name_en' => 'nullable|string',
            'items.*.sku' => 'nullable|string',
            'items.*.unit_price' => 'nullable|numeric',
            'items.*.quantity' => 'required|integer',
            'items.*.line_total' => 'nullable|numeric',
        ]);

        $order = DB::transaction(function () use ($data) {
            $order = Order::create([
                'order_number' => 'ORD-'.now()->format('Ymd-His'),
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'ship_address_line1' => $data['ship_address_line1'],
                'ship_address_line2' => $data['ship_address_line2'] ?? null,
                'ship_city' => $data['ship_city'],
                'ship_district' => $data['ship_district'] ?? null,
                'ship_postal_code' => $data['ship_postal_code'] ?? null,
                'ship_country' => $data['ship_country'] ?? 'BD',
                'currency_code' => $data['currency_code'] ?? 'BDT',
                'subtotal' => $data['subtotal'] ?? 0,
                'grand_total' => $data['grand_total'] ?? 0,
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
                'payment_status' => 'unpaid',
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name_bn' => $item['product_name_bn'] ?? '',
                    'product_name_en' => $item['product_name_en'] ?? '',
                    'sku' => $item['sku'] ?? '',
                    'unit_price' => $item['unit_price'] ?? 0,
                    'quantity' => $item['quantity'],
                    'line_total' => $item['line_total'] ?? 0,
                ]);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'new_status' => $order->status,
                'changed_at' => now(),
            ]);

            return $order->load('items');
        });

        return ApiResponse::created('Order created successfully', $order);
    }
}

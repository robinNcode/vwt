<?php

namespace App\Http\Controllers;

use App\DTOs\CheckoutDTO;
use App\Http\Requests\CheckoutRequest;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index(Request $request)
    {
        $orders = $this->orderService->getAdminOrders();
        return response()->json(['data' => $orders]);
    }

    public function checkout(CheckoutRequest $request)
    {
        try {
            $user = Auth::user();
            $dto = CheckoutDTO::fromRequest($request->validated());
            
            $order = $this->orderService->processCheckout($user, $dto);

            return response()->json(['data' => $order, 'message' => 'Checkout successful'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Checkout failed: ' . $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        
        $order = $this->orderService->updateOrderStatus($id, $request->status);
        
        return response()->json(['data' => $order, 'message' => 'Order status updated']);
    }
}

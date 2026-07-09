<?php

namespace App\Services;

use App\DTOs\CheckoutDTO;
use App\Models\Cart;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Exception;

class OrderService
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository
    ) {}

    public function getAdminOrders()
    {
        return $this->orderRepository->getAllPaginated(15);
    }

    public function updateOrderStatus(int $id, string $status)
    {
        return $this->orderRepository->updateStatus($id, $status);
    }

    public function processCheckout($user, CheckoutDTO $dto)
    {
        $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            throw new Exception("Cart is empty");
        }

        $subtotal = 0;
        $itemsData = [];

        foreach ($cart->items as $item) {
            $price = $item->product->price ?? 0;
            $subtotal += $price * $item->quantity;

            $itemsData[] = [
                'product_name_bn' => $item->product->name_bn ?? '',
                'product_name_en' => $item->product->name_en ?? '',
                'sku' => $item->product->sku ?? '',
                'unit_price' => $price,
                'quantity' => $item->quantity,
                'line_total' => $price * $item->quantity,
            ];
        }

        $orderData = [
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'customer_id' => $user->id,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $dto->phone ?? '',
            'ship_address_line1' => $dto->ship_address_line1,
            'ship_city' => $dto->ship_city,
            'subtotal' => $subtotal,
            'grand_total' => $subtotal, // Adding tax/shipping logic would go here
            'status' => 'pending',
            'payment_method' => $dto->payment_method,
        ];

        // Creates order and clears cart within transaction logic inside repository
        $order = $this->orderRepository->createOrderWithItems($orderData, $itemsData);

        // Clear Cart Post-Checkout
        $cart->items()->delete();
        $cart->delete();

        return $order;
    }
}

<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Models\OrderItem;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        return Order::with('items')->paginate($perPage);
    }

    public function findById(int $id)
    {
        return Order::with('items')->findOrFail($id);
    }

    public function createOrderWithItems(array $orderData, array $itemsData)
    {
        return DB::transaction(function () use ($orderData, $itemsData) {
            $order = Order::create($orderData);

            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return $order->load('items');
        });
    }

    public function updateStatus(int $id, string $status)
    {
        $order = $this->findById($id);
        $order->update(['status' => $status]);
        return $order;
    }
}

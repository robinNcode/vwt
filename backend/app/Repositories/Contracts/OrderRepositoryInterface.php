<?php

namespace App\Repositories\Contracts;

interface OrderRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15);
    public function findById(int $id);
    public function createOrderWithItems(array $orderData, array $itemsData);
    public function updateStatus(int $id, string $status);
}

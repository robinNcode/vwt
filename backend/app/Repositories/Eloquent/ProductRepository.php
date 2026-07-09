<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15)
    {
        // Returns a full collection (Go parity: the API returns arrays, not paginators).
        return Product::with('images')->orderByDesc('id')->get();
    }

    public function getActivePaginated(int $perPage = 15)
    {
        return Product::where('is_active', true)->with('images')->orderByDesc('id')->get();
    }

    public function findById(int $id)
    {
        return Product::findOrFail($id);
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update(int $id, array $data)
    {
        $product = $this->findById($id);
        $product->update($data);
        return $product;
    }

    public function delete(int $id)
    {
        $product = $this->findById($id);
        return $product->delete();
    }
}

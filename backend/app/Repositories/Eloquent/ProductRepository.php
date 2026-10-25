<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class ProductRepository implements ProductRepositoryInterface
{
    /** Cache TTL in seconds (30 minutes) */
    private const CACHE_TTL = 1800;

    public function getAllPaginated(int $perPage = 15)
    {
        // Admin view is not cached (always fresh)
        return Product::with(['images' => fn ($q) => $q->orderBy('sort_order')->orderBy('id')])
            ->orderByDesc('id')
            ->get();
    }

    public function getActivePaginated(int $perPage = 15)
    {
        return Cache::remember('products.public', self::CACHE_TTL, function () {
            return Product::where('is_active', true)
                ->with(['images' => fn ($q) => $q->orderBy('sort_order')->orderBy('id')])
                ->orderByDesc('id')
                ->get();
        });
    }

    public function findById(int $id)
    {
        return Product::findOrFail($id);
    }

    public function create(array $data)
    {
        $product = Product::create($data);
        Cache::forget('products.public');
        return $product;
    }

    public function update(int $id, array $data)
    {
        $product = $this->findById($id);
        $product->update($data);
        Cache::forget('products.public');
        return $product;
    }

    public function delete(int $id)
    {
        $product = $this->findById($id);
        Cache::forget('products.public');
        return $product->delete();
    }
}

<?php

namespace App\Services;

use App\DTOs\ProductDTO;
use App\Repositories\Contracts\ProductRepositoryInterface;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {}

    public function getPublicProducts()
    {
        return $this->productRepository->getActivePaginated(10);
    }

    public function getAdminProducts()
    {
        return $this->productRepository->getAllPaginated(10);
    }

    public function createProduct(ProductDTO $dto)
    {
        // Business logic could be added here (e.g., dispatching events, logging)
        return $this->productRepository->create($dto->toArray());
    }

    public function updateProduct(int $id, ProductDTO $dto)
    {
        return $this->productRepository->update($id, $dto->toArray());
    }

    public function deleteProduct(int $id)
    {
        return $this->productRepository->delete($id);
    }
}

<?php

namespace App\DTOs;

class ProductDTO
{
    public function __construct(
        public readonly int $category_id,
        public readonly string $product_type,
        public readonly string $name_bn,
        public readonly string $name_en,
        public readonly string $slug,
        public readonly string $sku,
        public readonly float $price,
        public readonly int $stock,
        public readonly bool $is_active = true
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            $data['category_id'],
            $data['product_type'],
            $data['name_bn'],
            $data['name_en'],
            $data['slug'],
            $data['sku'],
            (float) $data['price'],
            (int) ($data['stock'] ?? 0),
            $data['is_active'] ?? true
        );
    }

    public function toArray(): array
    {
        return [
            'category_id' => $this->category_id,
            'product_type' => $this->product_type,
            'name_bn' => $this->name_bn,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'price' => $this->price,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
        ];
    }
}

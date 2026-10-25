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
        public readonly bool $is_active = true,
        public readonly bool $is_featured = false,
        public readonly ?string $brand = null,
        public readonly ?string $model_number = null,
        public readonly ?string $manufacturer = null,
        public readonly ?string $short_desc_en = null,
        public readonly ?string $short_desc_bn = null,
        public readonly ?string $description_en = null,
        public readonly ?string $description_bn = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            (int) $data['category_id'],
            $data['product_type'],
            $data['name_bn'],
            $data['name_en'],
            $data['slug'],
            $data['sku'],
            (float) $data['price'],
            (int) ($data['stock'] ?? 0),
            isset($data['is_active']) ? filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN) : true,
            isset($data['is_featured']) ? filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN) : false,
            $data['brand'] ?? null,
            $data['model_number'] ?? null,
            $data['manufacturer'] ?? null,
            $data['short_desc_en'] ?? null,
            $data['short_desc_bn'] ?? null,
            $data['description_en'] ?? null,
            $data['description_bn'] ?? null
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
            'is_featured' => $this->is_featured,
            'brand' => $this->brand,
            'model_number' => $this->model_number,
            'manufacturer' => $this->manufacturer,
            'short_desc_en' => $this->short_desc_en,
            'short_desc_bn' => $this->short_desc_bn,
            'description_en' => $this->description_en,
            'description_bn' => $this->description_bn,
        ];
    }
}

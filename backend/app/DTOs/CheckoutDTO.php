<?php

namespace App\DTOs;

class CheckoutDTO
{
    public function __construct(
        public readonly string $ship_address_line1,
        public readonly string $ship_city,
        public readonly string $payment_method,
        public readonly ?string $phone = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            $data['ship_address_line1'],
            $data['ship_city'],
            $data['payment_method'],
            $data['phone'] ?? null
        );
    }
}

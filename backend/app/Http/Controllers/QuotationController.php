<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    /**
     * List all quotations with their items, newest first.
     */
    public function index(Request $request)
    {
        return ApiResponse::ok('Quotations fetched successfully', Quotation::with('items')->orderByDesc('id')->get());
    }

    /**
     * Return a single quotation with its items.
     */
    public function show($id)
    {
        $quotation = Quotation::with('items')->find($id);
        if (! $quotation) {
            return ApiResponse::fail('Quotation not found', 404);
        }

        return ApiResponse::ok('Quotation fetched successfully', $quotation);
    }

    /**
     * Return the next sequential quotation number (QTN-NNNN).
     */
    public function nextNumber()
    {
        return ApiResponse::ok('Success', ['quotation_number' => $this->generateNextNumber()]);
    }

    /**
     * Create a quotation with its line items and computed line totals.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'nullable|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'customer_address' => 'nullable|string',
            'quotation_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'expires_at' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'nullable|integer',
            'items.*.product_name_en' => 'required|string',
            'items.*.sku' => 'required|string',
            'items.*.unit_price' => 'nullable|numeric',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $number = ! empty($data['quotation_number'])
            ? $data['quotation_number']
            : $this->generateNextNumber();

        $quotation = DB::transaction(function () use ($data, $number) {
            $quotation = Quotation::create([
                'quotation_number' => $number,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'customer_address' => $data['customer_address'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'draft',
                'expires_at' => $data['expires_at'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $unitPrice = $item['unit_price'] ?? 0;
                $quotation->items()->create([
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name_en' => trim($item['product_name_en']),
                    'sku' => trim($item['sku']),
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'line_total' => $unitPrice * $item['quantity'],
                ]);
            }

            return $quotation->load('items');
        });

        return ApiResponse::created('Quotation created successfully', $quotation);
    }

    /**
     * Update a quotation's status.
     */
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate(['status' => 'required|string']);
        $status = strtolower(trim($data['status']));

        $quotation = Quotation::find($id);
        if (! $quotation) {
            return ApiResponse::fail('Failed to update quotation', 500);
        }
        $quotation->status = $status;
        $quotation->save();

        return ApiResponse::ok('Quotation updated successfully', ['id' => (int) $id, 'status' => $status]);
    }

    /**
     * Compute the next quotation number by incrementing the latest QTN-NNNN.
     */
    protected function generateNextNumber(): string
    {
        $last = Quotation::orderByDesc('id')->value('quotation_number');
        if (! $last) {
            return 'QTN-1001';
        }
        if (str_starts_with($last, 'QTN-') && is_numeric(substr($last, 4))) {
            return 'QTN-'.((int) substr($last, 4) + 1);
        }

        return 'QTN-1001';
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * List all invoices, newest first.
     */
    public function index(Request $request)
    {
        return ApiResponse::ok('Invoices fetched successfully', Invoice::orderByDesc('id')->get());
    }

    /**
     * Return a single invoice with its related order.
     */
    public function show($id)
    {
        $invoice = Invoice::with('order')->find($id);
        if (! $invoice) {
            return ApiResponse::fail('Invoice not found', 404);
        }

        return ApiResponse::ok('Invoice fetched successfully', $invoice);
    }

    /**
     * Returns the next sequential invoice number (INV-NNNN), mirroring the Go
     * GetNextInvoiceNumber logic.
     */
    public function nextNumber()
    {
        return ApiResponse::ok('Success', ['invoice_number' => $this->generateNextNumber()]);
    }

    /**
     * Create an invoice, stamping the current time as the issue date.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'nullable|integer',
            'invoice_number' => 'required|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'template_config' => 'nullable',
        ]);

        $invoice = Invoice::create([
            'order_id' => ! empty($data['order_id']) ? $data['order_id'] : null,
            'invoice_number' => trim($data['invoice_number']),
            'issued_at' => now(),
            'due_date' => $data['due_date'] ?? null,
            'notes' => $data['notes'] ?? null,
            'template_config' => $data['template_config'] ?? null,
        ]);

        return ApiResponse::created('Invoice created successfully', $invoice);
    }

    /**
     * Update an existing invoice.
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);
        if (! $invoice) {
            return ApiResponse::fail('Invoice not found', 404);
        }

        $data = $request->validate([
            'order_id' => 'nullable|integer',
            'invoice_number' => 'required|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'template_config' => 'nullable',
        ]);

        $invoice->update([
            'order_id' => ! empty($data['order_id']) ? $data['order_id'] : null,
            'invoice_number' => trim($data['invoice_number']),
            'due_date' => $data['due_date'] ?? null,
            'notes' => $data['notes'] ?? null,
            'template_config' => $data['template_config'] ?? null,
        ]);

        return ApiResponse::ok('Invoice updated successfully', $invoice);
    }

    /**
     * Delete an invoice.
     */
    public function destroy($id)
    {
        $invoice = Invoice::find($id);
        if (! $invoice) {
            return ApiResponse::fail('Invoice not found', 404);
        }
        $invoice->delete();

        return ApiResponse::ok('Invoice deleted successfully', ['id' => (int) $id]);
    }

    protected function generateNextNumber(): string
    {
        $last = Invoice::orderByDesc('id')->value('invoice_number');
        if (! $last) {
            return 'INV-1001';
        }
        if (str_starts_with($last, 'INV-') && is_numeric(substr($last, 4))) {
            return 'INV-'.((int) substr($last, 4) + 1);
        }

        return 'INV-1001';
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::with('order')->paginate(15);
        return response()->json(['data' => $invoices]);
    }

    public function show($id)
    {
        $invoice = Invoice::with('order')->findOrFail($id);
        return response()->json(['data' => $invoice]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'issued_at' => 'required|date',
        ]);

        $invoice = Invoice::create($validated);
        return response()->json(['data' => $invoice, 'message' => 'Invoice created'], 201);
    }
}

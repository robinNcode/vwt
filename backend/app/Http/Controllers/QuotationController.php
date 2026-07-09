<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $quotations = Quotation::paginate(15);
        return response()->json(['data' => $quotations]);
    }

    public function show($id)
    {
        $quotation = Quotation::findOrFail($id);
        return response()->json(['data' => $quotation]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'quotation_number' => 'required|string|unique:quotations,quotation_number',
            'grand_total' => 'required|numeric',
        ]);

        $quotation = Quotation::create($validated);
        return response()->json(['data' => $quotation, 'message' => 'Quotation created'], 201);
    }
}

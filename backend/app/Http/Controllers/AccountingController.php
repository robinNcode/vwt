<?php

namespace App\Http\Controllers;

use App\Models\AccountingSale;
use App\Models\AccountingPurchase;
use App\Models\AccountingExpense;
use Illuminate\Http\Request;

class AccountingController extends Controller
{
    public function sales(Request $request)
    {
        return response()->json(['data' => AccountingSale::paginate(15)]);
    }

    public function storeSale(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'date' => 'required|date',
        ]);
        $sale = AccountingSale::create($validated);
        return response()->json(['data' => $sale, 'message' => 'Sale recorded'], 201);
    }

    public function purchases(Request $request)
    {
        return response()->json(['data' => AccountingPurchase::paginate(15)]);
    }

    public function storePurchase(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'vendor' => 'required|string',
            'date' => 'required|date',
        ]);
        $purchase = AccountingPurchase::create($validated);
        return response()->json(['data' => $purchase, 'message' => 'Purchase recorded'], 201);
    }

    public function expenses(Request $request)
    {
        return response()->json(['data' => AccountingExpense::paginate(15)]);
    }

    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'date' => 'required|date',
        ]);
        $expense = AccountingExpense::create($validated);
        return response()->json(['data' => $expense, 'message' => 'Expense recorded'], 201);
    }
}

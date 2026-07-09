<?php

namespace App\Http\Controllers;

use App\Models\AccountingExpense;
use App\Models\AccountingPurchase;
use App\Models\AccountingSale;
use App\Models\AccountingServiceRevenue;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AccountingController extends Controller
{
    // ─── Sales ────────────────────────────────────────────────────────────

    public function sales(Request $request)
    {
        return ApiResponse::ok('Sales fetched', AccountingSale::orderByDesc('date')->get());
    }

    public function storeSale(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        return ApiResponse::created('Sale created', AccountingSale::create($data));
    }

    public function destroySale($id)
    {
        return $this->destroyRecord(AccountingSale::find($id), 'Sale');
    }

    // ─── Purchases ────────────────────────────────────────────────────────

    public function purchases(Request $request)
    {
        return ApiResponse::ok('Purchases fetched', AccountingPurchase::orderByDesc('date')->get());
    }

    public function storePurchase(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'vendor' => 'nullable|string',
            'date' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        return ApiResponse::created('Purchase created', AccountingPurchase::create($data));
    }

    public function destroyPurchase($id)
    {
        return $this->destroyRecord(AccountingPurchase::find($id), 'Purchase');
    }

    // ─── Expenses ─────────────────────────────────────────────────────────

    public function expenses(Request $request)
    {
        return ApiResponse::ok('Expenses fetched', AccountingExpense::orderByDesc('date')->get());
    }

    public function storeExpense(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        return ApiResponse::created('Expense created', AccountingExpense::create($data));
    }

    public function destroyExpense($id)
    {
        return $this->destroyRecord(AccountingExpense::find($id), 'Expense');
    }

    // ─── Service Revenues ─────────────────────────────────────────────────

    public function serviceRevenues(Request $request)
    {
        return ApiResponse::ok('Service revenues fetched', AccountingServiceRevenue::orderByDesc('date')->get());
    }

    public function storeServiceRevenue(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'service_id' => 'nullable|integer',
            'date' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        return ApiResponse::created('Service revenue created', AccountingServiceRevenue::create($data));
    }

    public function destroyServiceRevenue($id)
    {
        return $this->destroyRecord(AccountingServiceRevenue::find($id), 'Service revenue');
    }

    protected function destroyRecord($record, string $label)
    {
        if (! $record) {
            return ApiResponse::fail($label.' not found', 404);
        }
        $record->delete();

        return ApiResponse::ok($label.' deleted');
    }
}

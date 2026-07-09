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

    /**
     * List all sales, most recent first.
     */
    public function sales(Request $request)
    {
        return ApiResponse::ok('Sales fetched', AccountingSale::orderByDesc('date')->get());
    }

    /**
     * Create a sale record.
     */
    public function storeSale(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        return ApiResponse::created('Sale created', AccountingSale::create($data));
    }

    /**
     * Delete a sale record.
     */
    public function destroySale($id)
    {
        return $this->destroyRecord(AccountingSale::find($id), 'Sale');
    }

    // ─── Purchases ────────────────────────────────────────────────────────

    /**
     * List all purchases, most recent first.
     */
    public function purchases(Request $request)
    {
        return ApiResponse::ok('Purchases fetched', AccountingPurchase::orderByDesc('date')->get());
    }

    /**
     * Create a purchase record.
     */
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

    /**
     * Delete a purchase record.
     */
    public function destroyPurchase($id)
    {
        return $this->destroyRecord(AccountingPurchase::find($id), 'Purchase');
    }

    // ─── Expenses ─────────────────────────────────────────────────────────

    /**
     * List all expenses, most recent first.
     */
    public function expenses(Request $request)
    {
        return ApiResponse::ok('Expenses fetched', AccountingExpense::orderByDesc('date')->get());
    }

    /**
     * Create an expense record.
     */
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

    /**
     * Delete an expense record.
     */
    public function destroyExpense($id)
    {
        return $this->destroyRecord(AccountingExpense::find($id), 'Expense');
    }

    // ─── Service Revenues ─────────────────────────────────────────────────

    /**
     * List all service revenue records, most recent first.
     */
    public function serviceRevenues(Request $request)
    {
        return ApiResponse::ok('Service revenues fetched', AccountingServiceRevenue::orderByDesc('date')->get());
    }

    /**
     * Create a service revenue record.
     */
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

    /**
     * Delete a service revenue record.
     */
    public function destroyServiceRevenue($id)
    {
        return $this->destroyRecord(AccountingServiceRevenue::find($id), 'Service revenue');
    }

    /**
     * Delete the given record, or return a 404 when it does not exist.
     */
    protected function destroyRecord($record, string $label)
    {
        if (! $record) {
            return ApiResponse::fail($label.' not found', 404);
        }
        $record->delete();

        return ApiResponse::ok($label.' deleted');
    }
}

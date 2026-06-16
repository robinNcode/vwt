<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\AccountingController;

// Public routes
Route::post('/v1/auth/login', [AuthController::class, 'adminLogin']);
Route::post('/v1/auth/customers/register', [AuthController::class, 'customerRegister']);

Route::get('/v1/products', [ProductController::class, 'listPublic']);
Route::get('/v1/services', [ServiceController::class, 'index']);

// Protected routes (Customer & Admin)
Route::middleware('auth:api')->group(function () {
    // Cart APIs
    Route::get('/v1/cart', [CartController::class, 'getCart']);
    Route::post('/v1/cart/items', [CartController::class, 'addItem']);
    Route::delete('/v1/cart/items/{id}', [CartController::class, 'removeItem']);
    
    // Checkout API
    Route::post('/v1/checkout', [OrderController::class, 'checkout']);
});

// Admin only routes
Route::middleware(['auth:api', 'role:admin'])->prefix('v1/admin')->group(function () {
    // Product Management
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    
    // Order Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}', [OrderController::class, 'updateStatus']);

    // Service Management
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    // Invoice Management
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::post('/invoices', [InvoiceController::class, 'store']);

    // Quotation Management
    Route::get('/quotations', [QuotationController::class, 'index']);
    Route::get('/quotations/{id}', [QuotationController::class, 'show']);
    Route::post('/quotations', [QuotationController::class, 'store']);

    // Accounting Management
    Route::get('/accounting/sales', [AccountingController::class, 'sales']);
    Route::post('/accounting/sales', [AccountingController::class, 'storeSale']);
    Route::get('/accounting/purchases', [AccountingController::class, 'purchases']);
    Route::post('/accounting/purchases', [AccountingController::class, 'storePurchase']);
    Route::get('/accounting/expenses', [AccountingController::class, 'expenses']);
    Route::post('/accounting/expenses', [AccountingController::class, 'storeExpense']);
});

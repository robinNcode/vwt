<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\WebSettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ImageUploadController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'adminLogin']);
    Route::post('/auth/customers/register', [AuthController::class, 'customerRegister']);

    Route::get('/products', [ProductController::class, 'listPublic']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/web-settings', [WebSettingController::class, 'show']);
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/banners', [BannerController::class, 'listPublic']);
    Route::get('/blog', [BlogController::class, 'listPublic']);
    Route::get('/blog/{slug}', [BlogController::class, 'showPublic']);

    // Orders (public create + tracking)
    Route::get('/orders/track/{id}', [OrderController::class, 'trackByNumber']);
    Route::get('/orders/{id}', [OrderController::class, 'getById']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::post('/quotations', [QuotationController::class, 'store']);
    Route::post('/contact-messages', [ContactController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Protected routes (Customer or Admin)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->middleware('auth:api,customer-api')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateQuantity']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('/cart', [CartController::class, 'clearCart']);
});

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/
Route::prefix('v1/admin')->middleware(['auth:api', 'admin'])->group(function () {
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}', [OrderController::class, 'updateStatus']);

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/next-number', [InvoiceController::class, 'nextNumber']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

    // Quotations
    Route::get('/quotations', [QuotationController::class, 'index']);
    Route::get('/quotations/next-number', [QuotationController::class, 'nextNumber']);
    Route::get('/quotations/{id}', [QuotationController::class, 'show']);
    Route::post('/quotations', [QuotationController::class, 'store']);
    Route::put('/quotations/{id}/status', [QuotationController::class, 'updateStatus']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/settings/group/{group}', [SettingController::class, 'showByGroup']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::patch('/settings/bulk', [SettingController::class, 'bulkUpdate']);
    Route::put('/settings/{id}', [SettingController::class, 'update']);
    Route::delete('/settings/{id}', [SettingController::class, 'destroy']);

    // Web settings (single JSON document)
    Route::get('/web-settings', [WebSettingController::class, 'show']);
    Route::get('/web-settings/group/{group}', [WebSettingController::class, 'showGroup']);
    Route::put('/web-settings', [WebSettingController::class, 'update']);

    // Contact messages
    Route::get('/contact-messages', [ContactController::class, 'index']);
    Route::get('/contact-messages/unread-count', [ContactController::class, 'unreadCount']);
    Route::put('/contact-messages/{id}/read', [ContactController::class, 'markRead']);

    // Profile
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/avatar', [UserController::class, 'updateAvatar']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);

    // Roles & Permissions
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/permissions', [RoleController::class, 'listPermissions']);
    Route::put('/roles/{id}/permissions', [RoleController::class, 'updatePermissions']);

    // Accounting
    Route::get('/accounting/sales', [AccountingController::class, 'sales']);
    Route::post('/accounting/sales', [AccountingController::class, 'storeSale']);
    Route::delete('/accounting/sales/{id}', [AccountingController::class, 'destroySale']);

    Route::get('/accounting/purchases', [AccountingController::class, 'purchases']);
    Route::post('/accounting/purchases', [AccountingController::class, 'storePurchase']);
    Route::delete('/accounting/purchases/{id}', [AccountingController::class, 'destroyPurchase']);

    Route::get('/accounting/expenses', [AccountingController::class, 'expenses']);
    Route::post('/accounting/expenses', [AccountingController::class, 'storeExpense']);
    Route::delete('/accounting/expenses/{id}', [AccountingController::class, 'destroyExpense']);

    Route::get('/accounting/service-revenues', [AccountingController::class, 'serviceRevenues']);
    Route::post('/accounting/service-revenues', [AccountingController::class, 'storeServiceRevenue']);
    Route::delete('/accounting/service-revenues/{id}', [AccountingController::class, 'destroyServiceRevenue']);

    // Banners
    Route::get('/banners', [BannerController::class, 'index']);
    Route::post('/banners', [BannerController::class, 'store']);

    // Blog
    Route::get('/blog', [BlogController::class, 'index']);
    Route::post('/blog', [BlogController::class, 'store']);

    // Image Upload (products, services, banners, general)
    Route::post('/upload', [ImageUploadController::class, 'upload']);

    // Cache management
    Route::post('/cache/clear', function () {
        \Illuminate\Support\Facades\Cache::flush();
        return \App\Support\ApiResponse::ok('Cache cleared successfully');
    });
});

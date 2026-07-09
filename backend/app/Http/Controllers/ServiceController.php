<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * List all services, newest first.
     */
    public function index(Request $request)
    {
        $services = Service::orderByDesc('id')->get();

        return ApiResponse::ok('Services fetched successfully', $services);
    }

    /**
     * Create a service.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => 'required|string',
            'name_bn' => 'required|string',
            'slug' => 'required|string|unique:services,slug',
            'description_bn' => 'nullable|string',
            'description_en' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image_url' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $service = Service::create($data);

        return ApiResponse::created('Service created successfully', $service);
    }

    /**
     * Update an existing service.
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->only([
            'name_en', 'name_bn', 'slug', 'description_bn', 'description_en',
            'price', 'image_url', 'is_active', 'sort_order',
        ]));

        return ApiResponse::ok('Service updated successfully', $service);
    }

    /**
     * Delete a service.
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return ApiResponse::ok('Service deleted successfully');
    }
}

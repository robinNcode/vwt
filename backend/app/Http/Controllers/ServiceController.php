<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::where('is_active', true)->paginate(10);
        return response()->json(['data' => $services]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string',
            'title_bn' => 'required|string',
            'slug' => 'required|string|unique:services,slug',
            'base_price' => 'required|numeric',
        ]);

        $service = Service::create($validated);
        return response()->json(['data' => $service, 'message' => 'Service created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->all());
        return response()->json(['data' => $service, 'message' => 'Service updated successfully']);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully']);
    }
}

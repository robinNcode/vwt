<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function listPublic()
    {
        return response()->json(['data' => Banner::where('is_active', true)->orderBy('sort_order')->get()]);
    }

    public function index()
    {
        return response()->json(['data' => Banner::paginate(10)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image_url' => 'required|string',
            'placement' => 'required|string',
        ]);
        $banner = Banner::create($validated);
        return response()->json(['data' => $banner, 'message' => 'Banner created'], 201);
    }
}

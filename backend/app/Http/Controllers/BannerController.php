<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function listPublic()
    {
        $banners = Banner::where('is_active', true)->orderBy('sort_order')->get();

        return ApiResponse::ok('Banners fetched successfully', $banners);
    }

    public function index()
    {
        return ApiResponse::ok('Banners fetched successfully', Banner::orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title_bn' => 'nullable|string',
            'title_en' => 'nullable|string',
            'subtitle_bn' => 'nullable|string',
            'subtitle_en' => 'nullable|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'placement' => 'required|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        return ApiResponse::created('Banner created successfully', Banner::create($data));
    }
}

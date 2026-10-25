<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Add specific role logic if needed
    }

    public function rules()
    {
        return [
            'category_id' => 'required|exists:product_categories,id',
            'product_type' => 'required|string',
            'name_bn' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'sku' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:150',
            'model_number' => 'nullable|string|max:150',
            'manufacturer' => 'nullable|string|max:200',
            'short_desc_en' => 'nullable|string',
            'short_desc_bn' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'image' => 'nullable|file|mimes:jpeg,jpg,png,webp,gif|max:8192',
            'image_url' => 'nullable|string',
            'thumbnail_url' => 'nullable|string',
        ];
    }
}

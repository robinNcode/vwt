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
            'slug' => 'required|string|unique:products,slug|max:255',
            'sku' => 'required|string|unique:products,sku|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ];
    }
}

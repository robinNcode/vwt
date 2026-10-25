<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Add specific role logic if needed
    }

    /**
     * Prepare inputs before validation (e.g. converting string booleans from multipart/form-data)
     */
    protected function prepareForValidation(): void
    {
        $merge = [];

        if ($this->has('is_active')) {
            $merge['is_active'] = filter_var($this->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
        }

        if ($this->has('is_featured')) {
            $merge['is_featured'] = filter_var($this->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }

        if ($this->has('category_id')) {
            $merge['category_id'] = (int) $this->input('category_id');
        }

        // If 'image' was submitted as empty or 0-byte file with no real content
        if ($this->hasFile('image')) {
            $uploaded = $this->file('image');
            if (!$uploaded || $uploaded->getSize() === 0) {
                unset($this['image']);
                $this->files->remove('image');
            }
        } else {
            unset($this['image']);
            $this->files->remove('image');
        }

        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules()
    {
        $hasRealImage = $this->hasFile('image') && $this->file('image')->getSize() > 0;

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
            'image' => $hasRealImage ? 'required|file|mimes:jpeg,jpg,png,webp,gif|max:8192' : 'nullable',
            'image_url' => 'nullable|string',
            'thumbnail_url' => 'nullable|string',
        ];
    }
}

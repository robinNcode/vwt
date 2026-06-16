<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Use policies for real auth
    }

    public function rules()
    {
        return [
            'ship_address_line1' => 'required|string|max:255',
            'ship_city' => 'required|string|max:100',
            'payment_method' => 'required|string|in:cash_on_delivery,bkash,nagad',
            'phone' => 'nullable|string|max:20',
        ];
    }
}

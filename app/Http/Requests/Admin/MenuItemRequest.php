<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $id = $this->route('menu_item')?->id;

        return [
            'menu_category_id' => ['required', 'integer', 'exists:menu_categories,id'],
            'name' => ['required', 'string', 'max:140'],
            'slug' => ['nullable', 'string', 'max:160', Rule::unique('menu_items', 'slug')->ignore($id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'details' => ['nullable', 'array'],
            'details.long_description' => ['nullable', 'string', 'max:2000'],
            'details.ingredients' => ['nullable', 'array'],
            'details.ingredients.*' => ['string', 'max:120'],
            'details.allergens' => ['nullable', 'array'],
            'details.allergens.*' => ['string', 'max:60'],
            'details.diet' => ['nullable', 'array'],
            'details.diet.*' => ['string', 'max:60'],
            'details.pairings' => ['nullable', 'array'],
            'details.pairings.*' => ['string', 'max:160'],
            'details.prep_time_min' => ['nullable', 'integer', 'min:0', 'max:240'],
            'details.calories' => ['nullable', 'integer', 'min:0', 'max:5000'],
            'details.portion' => ['nullable', 'string', 'max:80'],
            'details.spice_level' => ['nullable', 'integer', 'min:0', 'max:3'],
            'details.origin' => ['nullable', 'string', 'max:120'],
            'details.chef_note' => ['nullable', 'string', 'max:400'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'is_signature' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_new' => ['boolean'],
            'is_available' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}

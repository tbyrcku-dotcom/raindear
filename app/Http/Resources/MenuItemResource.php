<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'menu_category_id' => $this->menu_category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'details' => $this->details,
            'price' => (float) $this->price,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url,
            'is_signature' => $this->is_signature,
            'is_popular' => $this->is_popular,
            'is_new' => $this->is_new,
            'is_available' => $this->is_available,
            'sort_order' => $this->sort_order,
            'category' => new MenuCategoryResource($this->whenLoaded('category')),
        ];
    }
}

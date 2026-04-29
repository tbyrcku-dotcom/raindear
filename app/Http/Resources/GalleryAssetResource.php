<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url,
            'alt_text' => $this->alt_text,
            'sort_order' => $this->sort_order,
            'is_featured' => $this->is_featured,
        ];
    }
}

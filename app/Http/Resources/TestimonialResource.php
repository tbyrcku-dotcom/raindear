<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'rating' => $this->rating,
            'content' => $this->content,
            'source' => $this->source,
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

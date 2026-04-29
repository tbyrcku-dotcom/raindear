<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventInquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'outlet_id' => $this->outlet_id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'event_type' => $this->event_type,
            'event_date' => $this->event_date?->toDateString(),
            'guest_count' => $this->guest_count,
            'budget_estimate' => $this->budget_estimate,
            'notes' => $this->notes,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

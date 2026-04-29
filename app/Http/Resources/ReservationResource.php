<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'outlet_id' => $this->outlet_id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'reservation_date' => $this->reservation_date?->toDateString(),
            'reservation_time' => $this->reservation_time,
            'guest_count' => $this->guest_count,
            'occasion_type' => $this->occasion_type,
            'notes' => $this->notes,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

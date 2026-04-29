<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventInquiry extends Model
{
    use HasFactory;

    public const STATUSES = ['pending', 'in_review', 'confirmed', 'declined', 'completed'];

    protected $fillable = [
        'outlet_id', 'name', 'phone', 'email', 'event_type', 'event_date',
        'guest_count', 'budget_estimate', 'notes', 'status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'guest_count' => 'integer',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }
}

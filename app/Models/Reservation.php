<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    public const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

    protected $fillable = [
        'outlet_id', 'name', 'phone', 'email', 'reservation_date', 'reservation_time',
        'guest_count', 'occasion_type', 'notes', 'status',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'guest_count' => 'integer',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }
}

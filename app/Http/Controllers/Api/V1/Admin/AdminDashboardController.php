<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\MenuItem;
use App\Models\Promotion;
use App\Models\Reservation;
use Illuminate\Support\Carbon;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'data' => [
                'menu_items_total' => MenuItem::count(),
                'reservations_pending' => Reservation::where('status', 'pending')->count(),
                'reservations_today' => Reservation::whereDate('reservation_date', Carbon::today())->count(),
                'unread_messages' => ContactMessage::where('status', 'unread')->count(),
                'active_promotions' => Promotion::where('is_active', true)
                    ->where(fn ($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', Carbon::today()))
                    ->count(),
                'recent_reservations' => Reservation::latest()->take(5)->get(),
                'recent_messages' => ContactMessage::latest()->take(5)->get(),
            ],
        ]);
    }
}

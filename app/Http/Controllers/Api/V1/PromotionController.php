<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use Illuminate\Support\Carbon;

class PromotionController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $promos = Promotion::query()
            ->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
            })
            ->orderByDesc('start_date')
            ->get();

        return PromotionResource::collection($promos);
    }
}

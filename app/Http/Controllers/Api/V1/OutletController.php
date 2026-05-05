<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OutletResource;
use App\Models\Outlet;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::query()
            ->where('is_active', true)
            ->with('openingHours')
            ->orderBy('name')
            ->get();

        return OutletResource::collection($outlets);
    }

    public function show(string $slug)
    {
        $outlet = Outlet::query()
            ->where('slug', $slug)
            ->with('openingHours')
            ->firstOrFail();

        return new OutletResource($outlet);
    }
}

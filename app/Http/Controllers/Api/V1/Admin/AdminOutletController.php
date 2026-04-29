<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OutletRequest;
use App\Http\Resources\OutletResource;
use App\Models\Outlet;

class AdminOutletController extends Controller
{
    public function index()
    {
        return OutletResource::collection(Outlet::with('openingHours')->orderBy('name')->get());
    }

    public function store(OutletRequest $request)
    {
        $outlet = Outlet::create($request->validated());

        return (new OutletResource($outlet))->response()->setStatusCode(201);
    }

    public function show(Outlet $outlet)
    {
        return new OutletResource($outlet->load('openingHours'));
    }

    public function update(OutletRequest $request, Outlet $outlet)
    {
        $outlet->update($request->validated());

        return new OutletResource($outlet->fresh()->load('openingHours'));
    }

    public function destroy(Outlet $outlet)
    {
        $outlet->delete();

        return response()->noContent();
    }
}

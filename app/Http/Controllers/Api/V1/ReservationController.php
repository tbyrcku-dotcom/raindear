<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function store(StoreReservationRequest $request)
    {
        $reservation = Reservation::create($request->validated() + ['status' => 'pending']);

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }
}

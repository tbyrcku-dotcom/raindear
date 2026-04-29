<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminReservationController extends Controller
{
    public function index(Request $request)
    {
        $q = Reservation::query();
        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }
        if ($request->filled('search')) {
            $term = '%'.$request->string('search').'%';
            $q->where(fn ($s) => $s->where('name', 'like', $term)->orWhere('phone', 'like', $term)->orWhere('email', 'like', $term));
        }

        return ReservationResource::collection($q->latest()->paginate(30));
    }

    public function show(Reservation $reservation)
    {
        return new ReservationResource($reservation);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Reservation::STATUSES)],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);
        $reservation->update($data);

        return new ReservationResource($reservation->fresh());
    }
}

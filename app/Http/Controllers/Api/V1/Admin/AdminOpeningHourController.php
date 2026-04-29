<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OpeningHourRequest;
use App\Http\Resources\OpeningHourResource;
use App\Models\OpeningHour;

class AdminOpeningHourController extends Controller
{
    public function index()
    {
        return OpeningHourResource::collection(OpeningHour::orderBy('outlet_id')->orderBy('day_of_week')->get());
    }

    public function store(OpeningHourRequest $request)
    {
        $row = OpeningHour::updateOrCreate(
            ['outlet_id' => $request->validated('outlet_id'), 'day_of_week' => $request->validated('day_of_week')],
            $request->validated()
        );

        return (new OpeningHourResource($row))->response()->setStatusCode(201);
    }

    public function update(OpeningHourRequest $request, OpeningHour $opening_hour)
    {
        $opening_hour->update($request->validated());

        return new OpeningHourResource($opening_hour->fresh());
    }

    public function destroy(OpeningHour $opening_hour)
    {
        $opening_hour->delete();

        return response()->noContent();
    }
}

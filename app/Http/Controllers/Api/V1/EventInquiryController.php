<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEventInquiryRequest;
use App\Http\Resources\EventInquiryResource;
use App\Models\EventInquiry;

class EventInquiryController extends Controller
{
    public function store(StoreEventInquiryRequest $request)
    {
        $inquiry = EventInquiry::create($request->validated() + ['status' => 'pending']);

        return (new EventInquiryResource($inquiry))
            ->response()
            ->setStatusCode(201);
    }
}

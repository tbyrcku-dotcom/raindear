<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventInquiryResource;
use App\Models\EventInquiry;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminEventInquiryController extends Controller
{
    public function index(Request $request)
    {
        $q = EventInquiry::query();
        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }

        return EventInquiryResource::collection($q->latest()->paginate(30));
    }

    public function show(EventInquiry $event_inquiry)
    {
        return new EventInquiryResource($event_inquiry);
    }

    public function update(Request $request, EventInquiry $event_inquiry)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(EventInquiry::STATUSES)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $event_inquiry->update($data);

        return new EventInquiryResource($event_inquiry->fresh());
    }
}

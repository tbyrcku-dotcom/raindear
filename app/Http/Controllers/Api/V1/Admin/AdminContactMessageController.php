<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $q = ContactMessage::query();
        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }

        return ContactMessageResource::collection($q->latest()->paginate(30));
    }

    public function show(ContactMessage $contact_message)
    {
        return new ContactMessageResource($contact_message);
    }

    public function update(Request $request, ContactMessage $contact_message)
    {
        $data = $request->validate(['status' => ['required', Rule::in(ContactMessage::STATUSES)]]);
        $contact_message->update($data);

        return new ContactMessageResource($contact_message->fresh());
    }
}

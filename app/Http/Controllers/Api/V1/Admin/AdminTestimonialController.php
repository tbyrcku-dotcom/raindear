<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class AdminTestimonialController extends Controller
{
    public function index(Request $request)
    {
        return TestimonialResource::collection(Testimonial::latest()->paginate(30));
    }

    public function store(TestimonialRequest $request)
    {
        $t = Testimonial::create($request->validated());

        return (new TestimonialResource($t))->response()->setStatusCode(201);
    }

    public function show(Testimonial $testimonial)
    {
        return new TestimonialResource($testimonial);
    }

    public function update(TestimonialRequest $request, Testimonial $testimonial)
    {
        $testimonial->update($request->validated());

        return new TestimonialResource($testimonial->fresh());
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->noContent();
    }
}

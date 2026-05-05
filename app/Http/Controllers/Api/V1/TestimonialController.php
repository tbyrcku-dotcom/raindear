<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::query();
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        return TestimonialResource::collection($query->latest()->get());
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromotionRequest;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use Illuminate\Support\Facades\Storage;

class AdminPromotionController extends Controller
{
    public function index()
    {
        return PromotionResource::collection(Promotion::latest()->paginate(30));
    }

    public function store(PromotionRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('promotions', 'public');
        }
        unset($data['image']);
        $promo = Promotion::create($data);

        return (new PromotionResource($promo))->response()->setStatusCode(201);
    }

    public function show(Promotion $promotion)
    {
        return new PromotionResource($promotion);
    }

    public function update(PromotionRequest $request, Promotion $promotion)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            if ($promotion->image_path && ! str_starts_with($promotion->image_path, 'http')) {
                Storage::disk('public')->delete($promotion->image_path);
            }
            $data['image_path'] = $request->file('image')->store('promotions', 'public');
        }
        unset($data['image']);
        $promotion->update($data);

        return new PromotionResource($promotion->fresh());
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return response()->noContent();
    }
}

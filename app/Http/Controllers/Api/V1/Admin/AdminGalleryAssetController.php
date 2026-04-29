<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryAssetRequest;
use App\Http\Resources\GalleryAssetResource;
use App\Models\GalleryAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminGalleryAssetController extends Controller
{
    public function index(Request $request)
    {
        $q = GalleryAsset::query();
        if ($request->filled('category')) {
            $q->where('category', $request->string('category'));
        }

        return GalleryAssetResource::collection($q->orderByDesc('is_featured')->orderBy('sort_order')->paginate(40));
    }

    public function store(GalleryAssetRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('gallery', 'public');
        }
        unset($data['image']);
        if (empty($data['image_path'])) {
            return response()->json(['message' => 'image or image_path is required'], 422);
        }
        $asset = GalleryAsset::create($data);

        return (new GalleryAssetResource($asset))->response()->setStatusCode(201);
    }

    public function show(GalleryAsset $gallery_asset)
    {
        return new GalleryAssetResource($gallery_asset);
    }

    public function update(GalleryAssetRequest $request, GalleryAsset $gallery_asset)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            if ($gallery_asset->image_path && ! str_starts_with($gallery_asset->image_path, 'http')) {
                Storage::disk('public')->delete($gallery_asset->image_path);
            }
            $data['image_path'] = $request->file('image')->store('gallery', 'public');
        }
        unset($data['image']);
        $gallery_asset->update($data);

        return new GalleryAssetResource($gallery_asset->fresh());
    }

    public function destroy(GalleryAsset $gallery_asset)
    {
        $gallery_asset->delete();

        return response()->noContent();
    }
}

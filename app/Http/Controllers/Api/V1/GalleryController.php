<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryAssetResource;
use App\Models\GalleryAsset;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryAsset::query();

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        $assets = $query->orderByDesc('is_featured')->orderBy('sort_order')->get();

        return GalleryAssetResource::collection($assets);
    }
}

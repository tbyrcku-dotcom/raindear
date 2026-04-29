<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::query()
            ->with('category')
            ->where('is_available', true);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->string('category')));
        }
        if ($request->filled('search')) {
            $term = '%'.$request->string('search').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $term)->orWhere('description', 'like', $term));
        }
        if ($request->boolean('popular')) {
            $query->where('is_popular', true);
        }
        if ($request->boolean('signature')) {
            $query->where('is_signature', true);
        }
        if ($request->boolean('new')) {
            $query->where('is_new', true);
        }

        $items = $query->orderBy('sort_order')->orderBy('name')->get();

        return MenuItemResource::collection($items);
    }

    public function show(string $slug)
    {
        $item = MenuItem::with('category')->where('slug', $slug)->firstOrFail();

        return new MenuItemResource($item);
    }
}

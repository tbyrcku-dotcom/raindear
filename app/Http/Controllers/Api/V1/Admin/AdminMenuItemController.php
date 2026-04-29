<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminMenuItemController extends Controller
{
    public function index(Request $request)
    {
        $q = MenuItem::query()->with('category');
        if ($request->filled('search')) {
            $q->where('name', 'like', '%'.$request->string('search').'%');
        }
        if ($request->filled('category')) {
            $q->whereHas('category', fn ($q2) => $q2->where('slug', $request->string('category')));
        }

        return MenuItemResource::collection($q->orderBy('sort_order')->orderBy('name')->paginate(30));
    }

    public function store(MenuItemRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('menu', 'public');
        }
        unset($data['image']);
        $item = MenuItem::create($data);

        return (new MenuItemResource($item->load('category')))->response()->setStatusCode(201);
    }

    public function show(MenuItem $menu_item)
    {
        return new MenuItemResource($menu_item->load('category'));
    }

    public function update(MenuItemRequest $request, MenuItem $menu_item)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            if ($menu_item->image_path && ! str_starts_with($menu_item->image_path, 'http')) {
                Storage::disk('public')->delete($menu_item->image_path);
            }
            $data['image_path'] = $request->file('image')->store('menu', 'public');
        }
        unset($data['image']);
        $menu_item->update($data);

        return new MenuItemResource($menu_item->fresh()->load('category'));
    }

    public function destroy(MenuItem $menu_item)
    {
        $menu_item->delete();

        return response()->noContent();
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MenuCategoryRequest;
use App\Http\Resources\MenuCategoryResource;
use App\Models\MenuCategory;
use Illuminate\Http\Request;

class AdminMenuCategoryController extends Controller
{
    public function index(Request $request)
    {
        $q = MenuCategory::query()->withCount('menuItems');
        if ($request->filled('search')) {
            $q->where('name', 'like', '%'.$request->string('search').'%');
        }

        return MenuCategoryResource::collection($q->orderBy('sort_order')->orderBy('name')->paginate(50));
    }

    public function store(MenuCategoryRequest $request)
    {
        $category = MenuCategory::create($request->validated());

        return (new MenuCategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(MenuCategory $menu_category)
    {
        return new MenuCategoryResource($menu_category->loadCount('menuItems'));
    }

    public function update(MenuCategoryRequest $request, MenuCategory $menu_category)
    {
        $menu_category->update($request->validated());

        return new MenuCategoryResource($menu_category->fresh());
    }

    public function destroy(MenuCategory $menu_category)
    {
        $menu_category->delete();

        return response()->noContent();
    }
}

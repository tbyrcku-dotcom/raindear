<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuCategoryResource;
use App\Models\MenuCategory;

class MenuCategoryController extends Controller
{
    public function index()
    {
        $categories = MenuCategory::query()
            ->where('is_active', true)
            ->withCount(['menuItems' => fn ($q) => $q->where('is_available', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return MenuCategoryResource::collection($categories);
    }
}

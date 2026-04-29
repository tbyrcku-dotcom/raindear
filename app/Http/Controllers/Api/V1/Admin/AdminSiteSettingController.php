<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Models\SiteSetting;

class AdminSiteSettingController extends Controller
{
    public function index()
    {
        return response()->json(['data' => SiteSetting::orderBy('group')->orderBy('key')->get()]);
    }

    public function store(SiteSettingRequest $request)
    {
        $s = SiteSetting::create($request->validated());

        return response()->json(['data' => $s], 201);
    }

    public function show(SiteSetting $site_setting)
    {
        return response()->json(['data' => $site_setting]);
    }

    public function update(SiteSettingRequest $request, SiteSetting $site_setting)
    {
        $site_setting->update($request->validated());

        return response()->json(['data' => $site_setting->fresh()]);
    }

    public function destroy(SiteSetting $site_setting)
    {
        $site_setting->delete();

        return response()->noContent();
    }
}

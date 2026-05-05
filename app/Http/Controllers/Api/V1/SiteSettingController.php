<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->mapWithKeys(function (SiteSetting $s) {
            return [$s->key => [
                'value' => $s->casted_value,
                'type' => $s->type,
                'group' => $s->group,
            ]];
        });

        return response()->json(['data' => $settings]);
    }
}

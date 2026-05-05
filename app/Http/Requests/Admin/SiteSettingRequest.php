<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $id = $this->route('site_setting')?->id;

        return [
            'key' => ['required', 'string', 'max:120', Rule::unique('site_settings', 'key')->ignore($id)],
            'value' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:string,json,boolean,number'],
            'group' => ['required', 'string', 'max:60'],
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    public function getCastedValueAttribute(): mixed
    {
        return match ($this->type) {
            'json' => json_decode((string) $this->value, true),
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'number' => is_numeric($this->value) ? $this->value + 0 : null,
            default => $this->value,
        };
    }
}

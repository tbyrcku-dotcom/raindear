<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'description', 'image_path', 'start_date', 'end_date', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['image_url'];

    protected static function booted(): void
    {
        static::saving(function (self $m) {
            if (! $m->slug) {
                $m->slug = Str::slug($m->title);
            }
        });
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }
        if (Str::startsWith($this->image_path, ['http://', 'https://', '/'])) {
            return $this->image_path;
        }

        return Storage::url($this->image_path);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'menu_category_id', 'name', 'slug', 'description', 'price', 'image_path',
        'is_signature', 'is_popular', 'is_new', 'is_available', 'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_signature' => 'boolean',
        'is_popular' => 'boolean',
        'is_new' => 'boolean',
        'is_available' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url'];

    protected static function booted(): void
    {
        static::saving(function (self $m) {
            if (! $m->slug) {
                $m->slug = Str::slug($m->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'menu_category_id');
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

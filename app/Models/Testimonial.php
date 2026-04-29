<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['customer_name', 'rating', 'content', 'source', 'is_featured'];

    protected $casts = [
        'rating' => 'integer',
        'is_featured' => 'boolean',
    ];
}

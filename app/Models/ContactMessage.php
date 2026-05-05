<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    public const STATUSES = ['unread', 'read', 'archived'];

    protected $fillable = ['name', 'email', 'phone', 'subject', 'message', 'status'];
}

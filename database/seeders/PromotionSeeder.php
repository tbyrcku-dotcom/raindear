<?php

namespace Database\Seeders;

use App\Models\Promotion;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        Promotion::updateOrCreate(
            ['slug' => 'birthday-celebration-package'],
            [
                'title' => 'Birthday Celebration Package',
                'description' => 'Decorate, dine, and celebrate. Includes set menu, cake setup, and a private corner.',
                'image_path' => '/img/promo/birthday.jpg',
                'is_active' => true,
            ],
        );
        Promotion::updateOrCreate(
            ['slug' => 'live-music-fridays'],
            [
                'title' => 'Live Music Fridays',
                'description' => 'Acoustic sets every Friday from 8 PM. Reserve a table by the stage.',
                'image_path' => '/img/promo/live-music.jpg',
                'is_active' => true,
            ],
        );
    }
}

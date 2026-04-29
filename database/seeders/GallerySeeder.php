<?php

namespace Database\Seeders;

use App\Models\GalleryAsset;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // Placeholder remote photo references. Replace with licensed/official Raindear assets.
        $assets = [
            ['title' => 'Indoor lounge', 'category' => 'interior', 'image_path' => '/img/gallery/interior-1.jpg', 'alt_text' => 'Warm-lit indoor lounge with timber tables and pendant lights', 'is_featured' => true, 'sort_order' => 1],
            ['title' => 'Bar counter', 'category' => 'interior', 'image_path' => '/img/gallery/interior-2.jpg', 'alt_text' => 'Espresso bar counter with a barista at work', 'sort_order' => 2],
            ['title' => 'Outdoor patio', 'category' => 'ambience', 'image_path' => '/img/gallery/ambience-1.jpg', 'alt_text' => 'Garden patio with hanging lights and lush greenery', 'is_featured' => true, 'sort_order' => 3],
            ['title' => 'Cumi Hitam plate', 'category' => 'food', 'image_path' => '/img/gallery/food-1.jpg', 'alt_text' => 'Black squid-ink fried rice plated with garnish', 'is_featured' => true, 'sort_order' => 4],
            ['title' => 'Wagyu', 'category' => 'food', 'image_path' => '/img/gallery/food-2.jpg', 'alt_text' => 'Sliced wagyu steak with truffle and roasted potatoes', 'sort_order' => 5],
            ['title' => 'Volcachino', 'category' => 'beverage', 'image_path' => '/img/gallery/beverage-1.jpg', 'alt_text' => 'Volcachino layered chocolate coffee in a glass', 'is_featured' => true, 'sort_order' => 6],
            ['title' => 'Cappuccino latte art', 'category' => 'beverage', 'image_path' => '/img/gallery/beverage-2.jpg', 'alt_text' => 'Cappuccino with rosetta latte art on a saucer', 'sort_order' => 7],
            ['title' => 'Birthday celebration', 'category' => 'event', 'image_path' => '/img/gallery/event-1.jpg', 'alt_text' => 'Birthday celebration table set with candles and dessert', 'sort_order' => 8],
            ['title' => 'Live music night', 'category' => 'event', 'image_path' => '/img/gallery/event-2.jpg', 'alt_text' => 'Live acoustic performance on a small wooden stage', 'sort_order' => 9],
        ];

        foreach ($assets as $a) {
            GalleryAsset::updateOrCreate(
                ['image_path' => $a['image_path']],
                array_merge(['is_featured' => false], $a),
            );
        }
    }
}

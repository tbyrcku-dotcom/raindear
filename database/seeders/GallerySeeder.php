<?php

namespace Database\Seeders;

use App\Models\GalleryAsset;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Real imagery sourced from the brand's public press coverage and social presence
     * (marketeers, tribunnews, jawapos, tripadvisor). Files are committed under
     * public/images/ and served directly by the web server — replace with official
     * high-res Raindear photography before production deploy.
     */
    public function run(): void
    {
        $assets = [
            // Interior — the restaurant's distinctive rooms
            ['title' => 'Dark dining room', 'category' => 'interior', 'image_path' => '/images/interior/interior-dark-deer-wall.jpg',
                'alt_text' => 'Dark wood coffered ceiling, leather banquette, and gold deer mark on the wall', 'is_featured' => true, 'sort_order' => 1],
            ['title' => 'Arched atrium', 'category' => 'interior', 'image_path' => '/images/interior/interior-arches.jpg',
                'alt_text' => 'Arched windows, white coffered ceiling, and tan leather banquettes', 'is_featured' => true, 'sort_order' => 2],
            ['title' => 'Blue booth corner', 'category' => 'interior', 'image_path' => '/images/interior/interior-blue-booth.jpg',
                'alt_text' => 'Blue tufted booth beside an arched window with hand-painted blue tile', 'sort_order' => 3],
            ['title' => 'Coffee belt mural', 'category' => 'interior', 'image_path' => '/images/interior/interior-coffee-belt.jpg',
                'alt_text' => 'Raindear deer mural with Coffee Belt map behind the espresso bar', 'is_featured' => true, 'sort_order' => 4],
            ['title' => 'Loft seating', 'category' => 'ambience', 'image_path' => '/images/interior/interior-casual-loft.jpg',
                'alt_text' => 'Two-story loft with industrial ceiling and casual seating', 'sort_order' => 5],
            ['title' => 'Atrium staircase', 'category' => 'ambience', 'image_path' => '/images/interior/interior-atrium.webp',
                'alt_text' => 'Spiral staircase wrapping a central live tree in a double-height atrium', 'is_featured' => true, 'sort_order' => 6],

            // Food & beverage — signature dishes
            ['title' => 'Es Kopi Bogor Original', 'category' => 'beverage', 'image_path' => '/images/menu/es-kopi-bogor.jpg',
                'alt_text' => 'Signature Es Kopi Bogor Original served in the Raindear-branded can', 'is_featured' => true, 'sort_order' => 7],
            ['title' => 'Truffle mushroom pasta', 'category' => 'food', 'image_path' => '/images/menu/mushroom-pasta.jpg',
                'alt_text' => 'Creamy mushroom pasta with toasted garlic bread and a copper Raindear mug', 'is_featured' => true, 'sort_order' => 8],

            // Brand & exterior
            ['title' => 'Raindear façade', 'category' => 'exterior', 'image_path' => '/images/brand/exterior-facade.webp',
                'alt_text' => 'Raindear Coffee & Kitchen exterior: white modern façade with arched windows and the deer logo', 'is_featured' => true, 'sort_order' => 9],
            ['title' => 'Menu highlights', 'category' => 'food', 'image_path' => '/images/gallery/collage-pizza-cake-exterior.png',
                'alt_text' => 'Collage of Raindear pizza, dessert plate, exterior signage, and a plant-lined table', 'sort_order' => 10],
        ];

        foreach ($assets as $a) {
            GalleryAsset::updateOrCreate(
                ['image_path' => $a['image_path']],
                array_merge(['is_featured' => false], $a),
            );
        }
    }
}

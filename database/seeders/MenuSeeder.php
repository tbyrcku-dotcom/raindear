<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Coffee', 'slug' => 'coffee', 'sort_order' => 1, 'description' => 'Crafted by our baristas. Slow-pulled, deep-roasted, Bogor-warm.'],
            ['name' => 'Beverages', 'slug' => 'beverages', 'sort_order' => 2, 'description' => 'Refreshments to go with the rain.'],
            ['name' => 'Signature', 'slug' => 'signature', 'sort_order' => 3, 'description' => 'Plates the kitchen is known for.'],
            ['name' => 'Main Course', 'slug' => 'main-course', 'sort_order' => 4, 'description' => 'Comfort dishes, big portions, big flavor.'],
            ['name' => 'Pasta', 'slug' => 'pasta', 'sort_order' => 5, 'description' => 'Hand-tossed, slow-simmered.'],
            ['name' => 'Rice', 'slug' => 'rice', 'sort_order' => 6, 'description' => 'Wok-charred Indonesian classics.'],
            ['name' => 'Appetizer', 'slug' => 'appetizer', 'sort_order' => 7, 'description' => 'Light starters to share.'],
            ['name' => 'Dessert', 'slug' => 'dessert', 'sort_order' => 8, 'description' => 'Sweet endings worth waiting for.'],
        ];

        $catModels = [];
        foreach ($categories as $c) {
            $catModels[$c['slug']] = MenuCategory::updateOrCreate(['slug' => $c['slug']], $c + ['is_active' => true]);
        }

        $items = [
            // Coffee
            ['cat' => 'coffee', 'name' => 'Es Kopi Bogor Original', 'price' => 28000, 'tags' => ['signature', 'popular'],
                'desc' => 'Our signature ice coffee — bold espresso, warm palm sugar, fresh milk.',
                'image' => '/images/menu/es-kopi-bogor.jpg'],
            ['cat' => 'coffee', 'name' => 'Cappuccino', 'price' => 32000, 'tags' => ['popular'],
                'desc' => 'Espresso, steamed milk, dense velvet foam.',
                'image' => '/images/menu/cappuccino.jpg'],
            ['cat' => 'coffee', 'name' => 'Volcachino', 'price' => 38000, 'tags' => ['signature'],
                'desc' => 'Layered chocolate-coffee build with a soft burnt finish.',
                'image' => '/images/menu/volcachino.jpg'],
            ['cat' => 'coffee', 'name' => 'Oatmilk Latte', 'price' => 36000, 'tags' => ['new'],
                'desc' => 'Single-origin espresso with creamy oat milk.',
                'image' => '/images/menu/oatmilk-latte.jpg'],

            // Beverages
            ['cat' => 'beverages', 'name' => 'Watermelon Mojito', 'price' => 35000, 'tags' => ['popular'],
                'desc' => 'Pressed watermelon, lime, mint, sparkling.',
                'image' => '/images/menu/watermelon-mojito.jpg'],
            ['cat' => 'beverages', 'name' => 'Lazy Bear Mousse', 'price' => 42000, 'tags' => ['signature', 'popular'],
                'desc' => 'Cold dessert drink — chocolate cream, mousse, espresso shot.',
                'image' => '/images/menu/lazy-bear-mousse.jpg'],
            ['cat' => 'beverages', 'name' => 'Puppy Chocolate Mousse', 'price' => 42000, 'tags' => ['popular'],
                'desc' => 'Rich chocolate mousse drink topped with whipped cream.',
                'image' => '/images/menu/puppy-chocolate-mousse.jpg'],

            // Signature
            ['cat' => 'signature', 'name' => 'Nasi Goreng Hitam (Cumi Hitam)', 'price' => 65000, 'tags' => ['signature', 'popular'],
                'desc' => 'Squid-ink fried rice with tender squid and bird-eye chili.',
                'image' => '/images/menu/nasi-goreng-hitam.jpg'],
            ['cat' => 'signature', 'name' => 'Wagyu Steak with Truffle Oil', 'price' => 245000, 'tags' => ['signature'],
                'desc' => 'Wagyu, charred crust, truffle oil, roasted potatoes, market greens.',
                'image' => '/images/menu/wagyu-steak.jpg'],
            ['cat' => 'signature', 'name' => 'Iga Bakar Jimbaran', 'price' => 145000, 'tags' => ['signature'],
                'desc' => 'Slow-grilled short ribs glazed with Jimbaran spices.',
                'image' => '/images/menu/iga-bakar-jimbaran.jpg'],

            // Main Course
            ['cat' => 'main-course', 'name' => 'Grilled Chicken Fettucine Carbonara', 'price' => 78000, 'tags' => ['popular'],
                'desc' => 'Grilled chicken, smoky bacon, parmesan-yolk emulsion.',
                'image' => '/images/menu/chicken-carbonara.jpg'],
            ['cat' => 'main-course', 'name' => 'Dory Sambal Matah', 'price' => 68000, 'tags' => [],
                'desc' => 'Pan-seared dory, raw shallot–lemongrass sambal.',
                'image' => '/images/menu/dory-sambal-matah.jpg'],
            ['cat' => 'main-course', 'name' => 'Pizza Margherita', 'price' => 72000, 'tags' => [],
                'desc' => 'Hand-stretched dough, San Marzano, fior di latte, basil.',
                'image' => '/images/menu/pizza-margherita.jpg'],

            // Pasta
            ['cat' => 'pasta', 'name' => 'Aglio Olio Tuna', 'price' => 65000, 'tags' => [],
                'desc' => 'Garlic-chili spaghetti, seared tuna, parsley.',
                'image' => '/images/menu/aglio-olio-tuna.jpg'],
            ['cat' => 'pasta', 'name' => 'Truffle Mushroom Beef Ravioli', 'price' => 95000, 'tags' => ['signature'],
                'desc' => 'Hand-folded ravioli, truffle cream, slow-braised beef.',
                'image' => '/images/menu/mushroom-pasta.jpg'],

            // Rice
            ['cat' => 'rice', 'name' => 'Nasi Goreng Kampung', 'price' => 55000, 'tags' => ['popular'],
                'desc' => 'Wok-charred village fried rice with anchovy and fried egg.',
                'image' => '/images/menu/nasi-goreng-kampung.jpg'],

            // Appetizer
            ['cat' => 'appetizer', 'name' => 'Classic Caesar Salad', 'price' => 58000, 'tags' => [],
                'desc' => 'Romaine, anchovy dressing, garlic croutons, parmesan.',
                'image' => '/images/menu/caesar-salad.jpg'],
            ['cat' => 'appetizer', 'name' => 'Thai Fresh Spring Roll', 'price' => 48000, 'tags' => [],
                'desc' => 'Rice paper, herbs, prawn, peanut-tamarind dip.',
                'image' => '/images/menu/thai-spring-roll.jpg'],

            // Dessert
            ['cat' => 'dessert', 'name' => 'Croissant Cookies Choco', 'price' => 38000, 'tags' => ['new'],
                'desc' => 'Crispy croissant cookie, dark chocolate ganache.',
                'image' => '/images/menu/croissant-cookies.jpg'],
        ];

        foreach ($items as $i => $row) {
            MenuItem::updateOrCreate(
                ['slug' => Str::slug($row['name'])],
                [
                    'menu_category_id' => $catModels[$row['cat']]->id,
                    'name' => $row['name'],
                    'description' => $row['desc'],
                    'price' => $row['price'],
                    'image_path' => $row['image'] ?? null,
                    'is_signature' => in_array('signature', $row['tags'], true),
                    'is_popular' => in_array('popular', $row['tags'], true),
                    'is_new' => in_array('new', $row['tags'], true),
                    'is_available' => true,
                    'sort_order' => $i,
                ],
            );
        }
    }
}

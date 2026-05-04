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
            [
                'cat' => 'coffee', 'name' => 'Es Kopi Bogor Original', 'price' => 28000, 'tags' => ['signature', 'popular'],
                'desc' => 'Our signature ice coffee — bold espresso, warm palm sugar, fresh milk.',
                'image' => '/images/menu/es-kopi-bogor.jpg',
                'details' => [
                    'long_description' => 'A hometown classic, slow-built over ice. Double-shot espresso meets liquid gula aren cooked to a soft caramel, finished with cold fresh milk. Stir before sipping.',
                    'ingredients' => ['Double espresso shot', 'Gula aren (palm sugar) syrup', 'Fresh whole milk', 'Hand-cracked ice'],
                    'allergens' => ['dairy'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Croissant Cookies Choco', 'Classic Caesar Salad'],
                    'prep_time_min' => 4,
                    'calories' => 180,
                    'portion' => 'Serves 1 · 350 ml',
                    'spice_level' => 0,
                    'origin' => 'Bogor, West Java',
                    'chef_note' => 'Stir gently — the gula aren should ribbon up the glass before it melts in.',
                ],
            ],
            [
                'cat' => 'coffee', 'name' => 'Cappuccino', 'price' => 32000, 'tags' => ['popular'],
                'desc' => 'Espresso, steamed milk, dense velvet foam.',
                'image' => '/images/menu/cappuccino.jpg',
                'details' => [
                    'long_description' => 'Single-origin espresso, steamed milk poured to a dense micro-foam. Finished with a free-pour rosetta.',
                    'ingredients' => ['Single-origin espresso', 'Whole milk, steamed to 65°C', 'Cocoa dusting (optional)'],
                    'allergens' => ['dairy'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Croissant Cookies Choco'],
                    'prep_time_min' => 3,
                    'calories' => 120,
                    'portion' => 'Serves 1 · 180 ml',
                    'spice_level' => 0,
                    'origin' => 'Italy (technique)',
                    'chef_note' => 'Drink within four minutes — that\'s when the foam still stands.',
                ],
            ],
            [
                'cat' => 'coffee', 'name' => 'Volcachino', 'price' => 38000, 'tags' => ['signature'],
                'desc' => 'Layered chocolate-coffee build with a soft burnt finish.',
                'image' => '/images/menu/volcachino.jpg',
                'details' => [
                    'long_description' => 'Three layers: dark chocolate ganache, espresso, and torched milk foam. The foam is finished with a quick blowtorch — a soft burnt sugar note runs through every sip.',
                    'ingredients' => ['Dark chocolate ganache 70%', 'Double espresso', 'Steamed milk foam', 'Torched demerara crust'],
                    'allergens' => ['dairy'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Lazy Bear Mousse', 'Puppy Chocolate Mousse'],
                    'prep_time_min' => 6,
                    'calories' => 280,
                    'portion' => 'Serves 1 · 240 ml',
                    'spice_level' => 0,
                    'origin' => 'Raindear original',
                    'chef_note' => 'Served with a long spoon — work down through the layers, don\'t stir.',
                ],
            ],
            [
                'cat' => 'coffee', 'name' => 'Oatmilk Latte', 'price' => 36000, 'tags' => ['new'],
                'desc' => 'Single-origin espresso with creamy oat milk.',
                'image' => '/images/menu/oatmilk-latte.jpg',
                'details' => [
                    'long_description' => 'Smooth oat milk steamed silky, pulled with a clean single-origin espresso. Naturally sweet, dairy-free.',
                    'ingredients' => ['Single-origin espresso', 'Barista oat milk', 'Light sugar (optional)'],
                    'allergens' => ['gluten (oat)'],
                    'diet' => ['vegan', 'dairy-free'],
                    'pairings' => ['Thai Fresh Spring Roll', 'Caesar Salad'],
                    'prep_time_min' => 3,
                    'calories' => 150,
                    'portion' => 'Serves 1 · 240 ml',
                    'spice_level' => 0,
                    'origin' => 'Raindear plant-based line',
                    'chef_note' => 'We use barista-grade oat milk that holds a tight micro-foam.',
                ],
            ],

            // Beverages
            [
                'cat' => 'beverages', 'name' => 'Watermelon Mojito', 'price' => 35000, 'tags' => ['popular'],
                'desc' => 'Pressed watermelon, lime, mint, sparkling.',
                'image' => '/images/menu/watermelon-mojito.jpg',
                'details' => [
                    'long_description' => 'Cold-pressed watermelon, muddled mint, fresh lime, topped with sparkling water. Non-alcoholic. Refreshing on a wet Bogor afternoon.',
                    'ingredients' => ['Cold-pressed watermelon juice', 'Fresh mint', 'Lime', 'Sparkling water', 'Light cane syrup'],
                    'allergens' => [],
                    'diet' => ['vegan', 'gluten-free', 'non-alcoholic'],
                    'pairings' => ['Pizza Margherita', 'Thai Fresh Spring Roll'],
                    'prep_time_min' => 4,
                    'calories' => 110,
                    'portion' => 'Serves 1 · 400 ml',
                    'spice_level' => 0,
                    'origin' => 'Raindear summer line',
                    'chef_note' => 'Bruise the mint — don\'t shred it. We want oils, not bitter chlorophyll.',
                ],
            ],
            [
                'cat' => 'beverages', 'name' => 'Lazy Bear Mousse', 'price' => 42000, 'tags' => ['signature', 'popular'],
                'desc' => 'Cold dessert drink — chocolate cream, mousse, espresso shot.',
                'image' => '/images/menu/lazy-bear-mousse.jpg',
                'details' => [
                    'long_description' => 'A drinkable dessert. Whipped chocolate mousse, cold milk, a single espresso shot poured tableside. Top sprinkled with cocoa nibs.',
                    'ingredients' => ['Whipped chocolate mousse', 'Cold whole milk', 'Single espresso shot', 'Cocoa nibs', 'Light sugar'],
                    'allergens' => ['dairy', 'egg'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Croissant Cookies Choco'],
                    'prep_time_min' => 7,
                    'calories' => 320,
                    'portion' => 'Serves 1 · 380 ml',
                    'spice_level' => 0,
                    'origin' => 'Raindear original',
                    'chef_note' => 'Pour the espresso last, slow, on top — let it cut a dark river through the mousse.',
                ],
            ],
            [
                'cat' => 'beverages', 'name' => 'Puppy Chocolate Mousse', 'price' => 42000, 'tags' => ['popular'],
                'desc' => 'Rich chocolate mousse drink topped with whipped cream.',
                'image' => '/images/menu/puppy-chocolate-mousse.jpg',
                'details' => [
                    'long_description' => 'Lighter sibling to the Lazy Bear. More milk, less espresso, cloud of cream on top, dusted with cocoa.',
                    'ingredients' => ['Cold whole milk', 'Chocolate mousse', 'Whipped cream', 'Cocoa powder'],
                    'allergens' => ['dairy', 'egg'],
                    'diet' => ['vegetarian', 'caffeine-free option'],
                    'pairings' => ['Croissant Cookies Choco', 'Caesar Salad'],
                    'prep_time_min' => 6,
                    'calories' => 290,
                    'portion' => 'Serves 1 · 380 ml',
                    'spice_level' => 0,
                    'origin' => 'Raindear original',
                    'chef_note' => 'Ask for "no shot" if you want this caffeine-free for the kids.',
                ],
            ],

            // Signature
            [
                'cat' => 'signature', 'name' => 'Nasi Goreng Hitam (Cumi Hitam)', 'price' => 65000, 'tags' => ['signature', 'popular'],
                'desc' => 'Squid-ink fried rice with tender squid and bird-eye chili.',
                'image' => '/images/menu/nasi-goreng-hitam.jpg',
                'details' => [
                    'long_description' => 'Long-grain rice wok-charred in squid ink and house sambal. Plated with grilled squid rings, half a fried egg, fried shallots, sliced cucumber.',
                    'ingredients' => ['Long-grain rice', 'Fresh squid + ink', 'Bird-eye chili', 'Garlic, shallot', 'Kecap manis', 'Fried egg', 'Cucumber, fried shallots'],
                    'allergens' => ['shellfish', 'egg', 'soy'],
                    'diet' => ['halal'],
                    'pairings' => ['Watermelon Mojito', 'Es Kopi Bogor Original'],
                    'prep_time_min' => 14,
                    'calories' => 540,
                    'portion' => 'Serves 1 · large plate',
                    'spice_level' => 2,
                    'origin' => 'Indonesia · Raindear signature',
                    'chef_note' => 'The wok must smoke before the rice goes in — that\'s where the char comes from.',
                ],
            ],
            [
                'cat' => 'signature', 'name' => 'Wagyu Steak with Truffle Oil', 'price' => 245000, 'tags' => ['signature'],
                'desc' => 'Wagyu, charred crust, truffle oil, roasted potatoes, market greens.',
                'image' => '/images/menu/wagyu-steak.jpg',
                'details' => [
                    'long_description' => '180g Wagyu MB5+, dry-aged 14 days, seared on cast iron. Finished with cold-pressed white truffle oil, butter-rosemary baste, served on warm potatoes and seasonal greens.',
                    'ingredients' => ['Wagyu MB5+ 180g', 'White truffle oil', 'Rosemary, thyme', 'Garlic butter', 'Roasted baby potato', 'Market greens'],
                    'allergens' => ['dairy'],
                    'diet' => ['halal-certified beef'],
                    'pairings' => ['Volcachino', 'Cappuccino'],
                    'prep_time_min' => 18,
                    'calories' => 720,
                    'portion' => 'Serves 1 · 180g cut',
                    'spice_level' => 0,
                    'origin' => 'Australia (sourcing) · Raindear kitchen',
                    'chef_note' => 'We default to medium-rare. Tell the server "blue / rare / medium / well" before we fire.',
                ],
            ],
            [
                'cat' => 'signature', 'name' => 'Iga Bakar Jimbaran', 'price' => 145000, 'tags' => ['signature'],
                'desc' => 'Slow-grilled short ribs glazed with Jimbaran spices.',
                'image' => '/images/menu/iga-bakar-jimbaran.jpg',
                'details' => [
                    'long_description' => 'Beef short ribs braised three hours then finished over charcoal with Jimbaran-style sambal matah glaze. Served with steamed rice and lalapan.',
                    'ingredients' => ['Beef short ribs', 'Sambal matah (raw shallot, lemongrass, kaffir lime, chili)', 'Coconut sugar', 'Steamed rice', 'Lalapan vegetables'],
                    'allergens' => ['shellfish (sambal trace)'],
                    'diet' => ['halal'],
                    'pairings' => ['Es Kopi Bogor Original', 'Watermelon Mojito'],
                    'prep_time_min' => 22,
                    'calories' => 680,
                    'portion' => 'Serves 1 · 250g ribs',
                    'spice_level' => 2,
                    'origin' => 'Bali · Jimbaran style',
                    'chef_note' => 'The ribs go on charcoal at the last minute — that\'s the smoke you taste.',
                ],
            ],

            // Main Course
            [
                'cat' => 'main-course', 'name' => 'Grilled Chicken Fettucine Carbonara', 'price' => 78000, 'tags' => ['popular'],
                'desc' => 'Grilled chicken, smoky bacon, parmesan-yolk emulsion.',
                'image' => '/images/menu/chicken-carbonara.jpg',
                'details' => [
                    'long_description' => 'Fresh fettucine tossed off-heat with egg yolk, parmesan and pecorino, smoky beef bacon, finished with grilled chicken and cracked black pepper.',
                    'ingredients' => ['Fresh fettucine', 'Egg yolk', 'Parmigiano + pecorino', 'Smoked beef bacon', 'Grilled chicken thigh', 'Black pepper'],
                    'allergens' => ['gluten', 'egg', 'dairy'],
                    'diet' => ['halal (beef bacon)'],
                    'pairings' => ['Cappuccino', 'Watermelon Mojito'],
                    'prep_time_min' => 16,
                    'calories' => 640,
                    'portion' => 'Serves 1 · 280g',
                    'spice_level' => 1,
                    'origin' => 'Italy (technique) · Raindear kitchen',
                    'chef_note' => 'No cream — ever. The silk comes from the yolk and pasta water.',
                ],
            ],
            [
                'cat' => 'main-course', 'name' => 'Dory Sambal Matah', 'price' => 68000, 'tags' => [],
                'desc' => 'Pan-seared dory, raw shallot–lemongrass sambal.',
                'image' => '/images/menu/dory-sambal-matah.jpg',
                'details' => [
                    'long_description' => 'Pan-seared dory fillet, crisp skin, blanketed with raw sambal matah — shallot, lemongrass, kaffir, bird-eye chili dressed in hot oil. Steamed rice on the side.',
                    'ingredients' => ['Dory fillet', 'Sambal matah', 'Lemongrass, kaffir lime, shallot', 'Bird-eye chili', 'Steamed rice'],
                    'allergens' => ['fish'],
                    'diet' => ['halal', 'pescatarian'],
                    'pairings' => ['Watermelon Mojito', 'Oatmilk Latte'],
                    'prep_time_min' => 12,
                    'calories' => 420,
                    'portion' => 'Serves 1 · 180g fillet',
                    'spice_level' => 2,
                    'origin' => 'Bali',
                    'chef_note' => 'Sambal matah is raw — bright, sharp, alive. Eat it fast.',
                ],
            ],
            [
                'cat' => 'main-course', 'name' => 'Pizza Margherita', 'price' => 72000, 'tags' => [],
                'desc' => 'Hand-stretched dough, San Marzano, fior di latte, basil.',
                'image' => '/images/menu/pizza-margherita.jpg',
                'details' => [
                    'long_description' => '24-hour cold-fermented dough, San Marzano tomato, fior di latte, fresh basil, finished with extra virgin olive oil. Wood-fired-style.',
                    'ingredients' => ['Cold-fermented dough', 'San Marzano tomato', 'Fior di latte', 'Fresh basil', 'EVOO'],
                    'allergens' => ['gluten', 'dairy'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Watermelon Mojito', 'Cappuccino'],
                    'prep_time_min' => 12,
                    'calories' => 580,
                    'portion' => 'Serves 1–2 · 10"',
                    'spice_level' => 0,
                    'origin' => 'Naples (style)',
                    'chef_note' => 'Eat the middle slices first — that\'s where the dough is thinnest and best.',
                ],
            ],

            // Pasta
            [
                'cat' => 'pasta', 'name' => 'Aglio Olio Tuna', 'price' => 65000, 'tags' => [],
                'desc' => 'Garlic-chili spaghetti, seared tuna, parsley.',
                'image' => '/images/menu/aglio-olio-tuna.jpg',
                'details' => [
                    'long_description' => 'Spaghetti tossed with confited garlic, chili flakes, EVOO. Topped with seared yellowfin tuna, parsley, lemon zest.',
                    'ingredients' => ['Spaghetti', 'Confit garlic', 'Chili flakes', 'EVOO', 'Yellowfin tuna', 'Parsley', 'Lemon zest'],
                    'allergens' => ['gluten', 'fish'],
                    'diet' => ['pescatarian', 'dairy-free'],
                    'pairings' => ['Oatmilk Latte', 'Watermelon Mojito'],
                    'prep_time_min' => 13,
                    'calories' => 540,
                    'portion' => 'Serves 1 · 260g',
                    'spice_level' => 2,
                    'origin' => 'Italy (technique)',
                    'chef_note' => 'Garlic must go in cold oil — slow toast, never burn.',
                ],
            ],
            [
                'cat' => 'pasta', 'name' => 'Truffle Mushroom Beef Ravioli', 'price' => 95000, 'tags' => ['signature'],
                'desc' => 'Hand-folded ravioli, truffle cream, slow-braised beef.',
                'image' => '/images/menu/mushroom-pasta.jpg',
                'details' => [
                    'long_description' => 'Hand-folded ravioli stuffed with slow-braised beef and porcini, sauced with truffle cream and shaved parmesan. Garnished with crisp sage.',
                    'ingredients' => ['Hand-folded pasta', 'Slow-braised beef', 'Porcini mushroom', 'Truffle cream', 'Parmesan', 'Crisp sage'],
                    'allergens' => ['gluten', 'egg', 'dairy'],
                    'diet' => ['halal'],
                    'pairings' => ['Volcachino', 'Cappuccino'],
                    'prep_time_min' => 18,
                    'calories' => 620,
                    'portion' => 'Serves 1 · 9 pieces',
                    'spice_level' => 0,
                    'origin' => 'Italy (technique) · Raindear kitchen',
                    'chef_note' => 'The ravioli are hand-pinched daily — first sitting from 11 AM.',
                ],
            ],

            // Rice
            [
                'cat' => 'rice', 'name' => 'Nasi Goreng Kampung', 'price' => 55000, 'tags' => ['popular'],
                'desc' => 'Wok-charred village fried rice with anchovy and fried egg.',
                'image' => '/images/menu/nasi-goreng-kampung.jpg',
                'details' => [
                    'long_description' => 'Day-old long-grain rice wok-charred with teri (anchovy), bird-eye chili, sweet soy. Served with fried egg, prawn cracker, fried shallots, cucumber.',
                    'ingredients' => ['Long-grain rice', 'Teri (anchovy)', 'Bird-eye chili', 'Kecap manis', 'Fried egg', 'Prawn cracker'],
                    'allergens' => ['fish', 'shellfish (cracker)', 'egg', 'soy'],
                    'diet' => ['halal'],
                    'pairings' => ['Es Kopi Bogor Original', 'Watermelon Mojito'],
                    'prep_time_min' => 11,
                    'calories' => 510,
                    'portion' => 'Serves 1 · large plate',
                    'spice_level' => 2,
                    'origin' => 'Indonesia · home-style',
                    'chef_note' => 'Day-old rice is the rule — fresh rice steams, it doesn\'t fry.',
                ],
            ],

            // Appetizer
            [
                'cat' => 'appetizer', 'name' => 'Classic Caesar Salad', 'price' => 58000, 'tags' => [],
                'desc' => 'Romaine, anchovy dressing, garlic croutons, parmesan.',
                'image' => '/images/menu/caesar-salad.jpg',
                'details' => [
                    'long_description' => 'Crisp romaine, house anchovy-yolk dressing, garlic sourdough croutons, shaved parmesan, cracked black pepper.',
                    'ingredients' => ['Romaine', 'Anchovy', 'Egg yolk dressing', 'Garlic sourdough croutons', 'Parmesan', 'Black pepper'],
                    'allergens' => ['fish', 'egg', 'gluten', 'dairy'],
                    'diet' => ['pescatarian'],
                    'pairings' => ['Cappuccino', 'Oatmilk Latte'],
                    'prep_time_min' => 7,
                    'calories' => 320,
                    'portion' => 'Serves 1 · starter bowl',
                    'spice_level' => 0,
                    'origin' => 'Tijuana (1924) · classic',
                    'chef_note' => 'Add a soft-poached egg (+15k) — it changes everything.',
                ],
            ],
            [
                'cat' => 'appetizer', 'name' => 'Thai Fresh Spring Roll', 'price' => 48000, 'tags' => [],
                'desc' => 'Rice paper, herbs, prawn, peanut-tamarind dip.',
                'image' => '/images/menu/thai-spring-roll.jpg',
                'details' => [
                    'long_description' => 'Cold rice-paper rolls of poached prawn, vermicelli, mint, basil, lettuce. Served with peanut-tamarind dipping sauce.',
                    'ingredients' => ['Rice paper', 'Poached prawn', 'Rice vermicelli', 'Mint, Thai basil', 'Lettuce', 'Peanut-tamarind sauce'],
                    'allergens' => ['shellfish', 'peanut'],
                    'diet' => ['gluten-free', 'dairy-free', 'pescatarian'],
                    'pairings' => ['Watermelon Mojito', 'Oatmilk Latte'],
                    'prep_time_min' => 8,
                    'calories' => 240,
                    'portion' => 'Serves 1–2 · 4 rolls',
                    'spice_level' => 1,
                    'origin' => 'Thailand · Vietnam',
                    'chef_note' => 'Eat fast — the wrappers tighten as they sit.',
                ],
            ],

            // Dessert
            [
                'cat' => 'dessert', 'name' => 'Croissant Cookies Choco', 'price' => 38000, 'tags' => ['new'],
                'desc' => 'Crispy croissant cookie, dark chocolate ganache.',
                'image' => '/images/menu/croissant-cookies.jpg',
                'details' => [
                    'long_description' => 'Laminated croissant dough re-rolled and baked twice into a crispy disk, brushed with dark chocolate ganache, dusted with icing sugar.',
                    'ingredients' => ['Laminated butter dough', 'Dark chocolate ganache 70%', 'Icing sugar', 'Sea salt flake'],
                    'allergens' => ['gluten', 'dairy', 'egg'],
                    'diet' => ['vegetarian'],
                    'pairings' => ['Cappuccino', 'Volcachino', 'Lazy Bear Mousse'],
                    'prep_time_min' => 5,
                    'calories' => 310,
                    'portion' => 'Serves 1 · 3 pieces',
                    'spice_level' => 0,
                    'origin' => 'Raindear pastry',
                    'chef_note' => 'Snap, dunk, repeat — built for coffee dipping.',
                ],
            ],
        ];

        foreach ($items as $i => $row) {
            MenuItem::updateOrCreate(
                ['slug' => Str::slug($row['name'])],
                [
                    'menu_category_id' => $catModels[$row['cat']]->id,
                    'name' => $row['name'],
                    'description' => $row['desc'],
                    'details' => $row['details'] ?? null,
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

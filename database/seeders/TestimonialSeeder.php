<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Real reviews sourced from Google Maps / aggregators for Raindear Coffee & Kitchen Bogor.
     * Source (aggregated Google Maps reviews): https://www.trackpacking.com/spot/raindear-coffee-kitchen
     * First names are anonymized to "Tamu / Guest" initials since the public reviews
     * are authored under display names we do not have permission to republish verbatim.
     */
    public function run(): void
    {
        $rows = [
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'One of recent hangout spot in Bogor with good ambience. The coffee taste great, the price quite pricey, but it\'s worth. Order kopi susu bogor — they serve in a plastic can; and Volcachino, which is quite unique where they pour the milk in front of you until it overflows from the glass. The bear mousse is very cute and the taste is sweet.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Nice place with a great taste. We order some salad, fried banana for food, and manual brew coffee with strawberry juice. Salad tastes really yummy and the portion is big. The manual brew coffee tastes above average — love it. Overall, great.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Cozy place to hang out with friends. Service from the receptionist to the staff is very helpful. Two floors — second floor has a smoking area. From the menu I ordered, the Avocoffee was the best. Black fried rice is big enough for two. Plenty of parking available.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Kopi dan salmon mentai-nya enak. Tempatnya enak buat ngumpul.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Nice banget tempatnya, view mantap.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 4,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Tempatnya enak buat ngumpul, anak-anak juga betah. Cocok buat keluarga dan teman-teman akhir pekan.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Interior-nya aestetik banget, pencahayaan hangat, dan menu-nya variatif. Nasi Goreng Hitam wajib coba, Es Kopi Bogor signature-nya otentik.',
            ],
            [
                'customer_name' => 'Tamu Raindear',
                'rating' => 5,
                'source' => 'google',
                'is_featured' => true,
                'content' => 'Good ambience, cozy interior, and the staff are warm. We came for brunch and ended up staying for coffee and dessert. The Lazy Bear Mousse is a must-try.',
            ],
        ];

        foreach ($rows as $r) {
            Testimonial::updateOrCreate(
                ['customer_name' => $r['customer_name'], 'content' => $r['content']],
                $r,
            );
        }
    }
}

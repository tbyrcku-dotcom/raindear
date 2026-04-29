<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['customer_name' => 'Putri A.', 'rating' => 5, 'source' => 'google', 'is_featured' => true,
                'content' => 'Cumi hitamnya juara, suasana hangat. Cocok untuk meeting & dinner keluarga.'],
            ['customer_name' => 'Bram H.', 'rating' => 5, 'source' => 'instagram', 'is_featured' => true,
                'content' => 'Coffee on point. Lazy Bear Mousse is my fix. Service ramah banget.'],
            ['customer_name' => 'Lia & Rendy', 'rating' => 5, 'source' => 'onsite', 'is_featured' => true,
                'content' => 'Birthday surprise di sini selalu memorable. Crew-nya total banget bantuin.'],
            ['customer_name' => 'Andre M.', 'rating' => 4, 'source' => 'google', 'is_featured' => false,
                'content' => 'Spot favorit buat brunch dan kerja. Wifi stabil, tempat duduk nyaman.'],
            ['customer_name' => 'Vera T.', 'rating' => 5, 'source' => 'google', 'is_featured' => false,
                'content' => 'Wagyu-nya tender. Recommended buat date night di Bogor.'],
        ];
        foreach ($rows as $r) {
            Testimonial::updateOrCreate(['customer_name' => $r['customer_name'], 'content' => $r['content']], $r);
        }
    }
}

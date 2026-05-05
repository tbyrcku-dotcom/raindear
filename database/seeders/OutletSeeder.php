<?php

namespace Database\Seeders;

use App\Models\OpeningHour;
use App\Models\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    public function run(): void
    {
        $outlet = Outlet::updateOrCreate(
            ['slug' => 'raindear-baranangsiang'],
            [
                'name' => 'Raindear Coffee & Kitchen — Baranangsiang',
                'address' => 'Jl. Bina Marga No.7, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143',
                'city' => 'Bogor',
                'phone' => '+62 821-1178-9089',
                'whatsapp' => '6282111789089',
                'email' => 'mkt.raindear@gmail.com',
                'google_maps_url' => 'https://maps.google.com/?q=Raindear+Coffee+Bogor',
                'latitude' => -6.6045,
                'longitude' => 106.8126,
                'description' => 'Bogor\'s warm table for coffee, kitchen, and celebration. Indoor and outdoor seating, family-friendly, and built for moments worth staying for.',
                'is_active' => true,
            ],
        );

        $hours = [
            ['day_of_week' => 0, 'open_time' => '09:00:00', 'close_time' => '23:00:00', 'is_closed' => false], // Sun
            ['day_of_week' => 1, 'open_time' => '09:00:00', 'close_time' => '23:00:00', 'is_closed' => false],
            ['day_of_week' => 2, 'open_time' => '09:00:00', 'close_time' => '23:00:00', 'is_closed' => false],
            ['day_of_week' => 3, 'open_time' => '09:00:00', 'close_time' => '23:00:00', 'is_closed' => false],
            ['day_of_week' => 4, 'open_time' => '09:00:00', 'close_time' => '23:00:00', 'is_closed' => false],
            ['day_of_week' => 5, 'open_time' => '09:00:00', 'close_time' => '24:00:00', 'is_closed' => false],
            ['day_of_week' => 6, 'open_time' => '09:00:00', 'close_time' => '24:00:00', 'is_closed' => false],
        ];
        foreach ($hours as $h) {
            OpeningHour::updateOrCreate(
                ['outlet_id' => $outlet->id, 'day_of_week' => $h['day_of_week']],
                $h,
            );
        }
    }
}

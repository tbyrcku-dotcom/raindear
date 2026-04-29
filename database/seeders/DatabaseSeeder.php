<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            OutletSeeder::class,
            SiteSettingSeeder::class,
            MenuSeeder::class,
            GallerySeeder::class,
            TestimonialSeeder::class,
            PromotionSeeder::class,
            ReservationSeeder::class,
            EventInquirySeeder::class,
            ContactMessageSeeder::class,
        ]);
    }
}

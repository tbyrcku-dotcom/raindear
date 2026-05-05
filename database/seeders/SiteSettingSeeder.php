<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'brand.name', 'value' => 'Raindear Coffee & Kitchen', 'type' => 'string', 'group' => 'brand'],
            ['key' => 'brand.tagline', 'value' => "Bogor's warm table for coffee, kitchen, and celebration.", 'type' => 'string', 'group' => 'brand'],
            ['key' => 'social.instagram', 'value' => 'https://instagram.com/raindearcoffee', 'type' => 'string', 'group' => 'social'],
            ['key' => 'social.tiktok', 'value' => 'https://www.tiktok.com/@raindearcoffee', 'type' => 'string', 'group' => 'social'],
            ['key' => 'social.facebook', 'value' => 'https://facebook.com/raindearcoffee', 'type' => 'string', 'group' => 'social'],
            ['key' => 'contact.phone', 'value' => '+62 821-1178-9089', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact.whatsapp', 'value' => '6282111789089', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact.email', 'value' => 'mkt.raindear@gmail.com', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'reservation.whatsapp_template', 'value' => "Hi Raindear, I'd like to reserve a table.\nName: {name}\nDate: {date}\nTime: {time}\nGuests: {guests}", 'type' => 'string', 'group' => 'reservation'],
        ];

        foreach ($settings as $s) {
            SiteSetting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}

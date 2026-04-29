<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        ContactMessage::create([
            'name' => 'Reza', 'email' => 'reza@example.com', 'phone' => '081299990000',
            'subject' => 'Catering inquiry',
            'message' => 'Halo, mau tanya apakah Raindear menerima catering untuk 50 pax?',
            'status' => 'unread',
        ]);
    }
}

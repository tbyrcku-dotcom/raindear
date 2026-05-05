<?php

namespace Database\Seeders;

use App\Models\EventInquiry;
use App\Models\Outlet;
use Illuminate\Database\Seeder;

class EventInquirySeeder extends Seeder
{
    public function run(): void
    {
        $outlet = Outlet::first();
        if (! $outlet) {
            return;
        }
        EventInquiry::create([
            'outlet_id' => $outlet->id,
            'name' => 'Dinda', 'phone' => '081200001111',
            'event_type' => 'birthday', 'event_date' => now()->addDays(20)->toDateString(),
            'guest_count' => 25, 'budget_estimate' => '5–8 jt',
            'notes' => 'Surprise birthday for husband, prefer outdoor patio.',
            'status' => 'pending',
        ]);
    }
}

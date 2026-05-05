<?php

namespace Database\Seeders;

use App\Models\Outlet;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $outlet = Outlet::first();
        if (! $outlet) {
            return;
        }
        $sample = [
            ['name' => 'Andini', 'phone' => '081234567811', 'reservation_date' => now()->addDays(2)->toDateString(), 'reservation_time' => '19:00', 'guest_count' => 4, 'occasion_type' => 'family', 'status' => 'pending'],
            ['name' => 'Bagus', 'phone' => '081234567822', 'reservation_date' => now()->addDays(1)->toDateString(), 'reservation_time' => '20:30', 'guest_count' => 2, 'occasion_type' => 'date', 'status' => 'confirmed'],
            ['name' => 'Citra', 'phone' => '081234567833', 'reservation_date' => now()->addDays(5)->toDateString(), 'reservation_time' => '12:30', 'guest_count' => 8, 'occasion_type' => 'birthday', 'status' => 'pending'],
        ];
        foreach ($sample as $row) {
            Reservation::create($row + ['outlet_id' => $outlet->id]);
        }
    }
}

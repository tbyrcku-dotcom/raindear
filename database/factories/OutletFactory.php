<?php

namespace Database\Factories;

use App\Models\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OutletFactory extends Factory
{
    protected $model = Outlet::class;

    public function definition(): array
    {
        $name = 'Raindear · '.$this->faker->city();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 9999),
            'address' => $this->faker->address(),
            'city' => 'Bogor',
            'phone' => '+62 821-1178-9089',
            'whatsapp' => '6282111789089',
            'email' => 'mkt.raindear@gmail.com',
            'google_maps_url' => 'https://maps.google.com/?q=Raindear+Coffee+Bogor',
            'latitude' => -6.6045,
            'longitude' => 106.8200,
            'description' => 'Test outlet.',
            'is_active' => true,
        ];
    }
}

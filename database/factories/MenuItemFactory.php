<?php

namespace Database\Factories;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'menu_category_id' => MenuCategory::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(20000, 250000),
            'image_path' => null,
            'is_signature' => false,
            'is_popular' => false,
            'is_new' => false,
            'is_available' => true,
            'sort_order' => 0,
        ];
    }
}

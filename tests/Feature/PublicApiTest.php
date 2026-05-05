<?php

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Outlet;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('responds to health check', function () {
    $this->getJson('/api/v1/health')->assertOk()->assertJson(['status' => 'ok']);
});

it('lists outlets', function () {
    Outlet::factory()->create(['name' => 'Raindear · Test', 'is_active' => true]);

    $this->getJson('/api/v1/outlets')
        ->assertOk()
        ->assertJsonPath('data.0.name', 'Raindear · Test');
});

it('filters menu items by signature flag', function () {
    $cat = MenuCategory::factory()->create();
    MenuItem::factory()->for($cat, 'category')->create(['name' => 'Sig', 'is_signature' => true]);
    MenuItem::factory()->for($cat, 'category')->create(['name' => 'Plain', 'is_signature' => false]);

    $r = $this->getJson('/api/v1/menu-items?signature=true')->assertOk();
    expect(collect($r->json('data'))->pluck('name')->all())->toContain('Sig')->not->toContain('Plain');
});

it('accepts a reservation submission', function () {
    Outlet::factory()->create();

    $payload = [
        'name' => 'Aulia',
        'phone' => '081234567890',
        'email' => 'aulia@example.com',
        'reservation_date' => now()->addDay()->toDateString(),
        'reservation_time' => '19:30',
        'guest_count' => 4,
        'occasion_type' => 'birthday',
        'notes' => 'Window seat please',
    ];

    $this->postJson('/api/v1/reservations', $payload)
        ->assertCreated()
        ->assertJsonPath('data.name', 'Aulia')
        ->assertJsonPath('data.status', 'pending');
});

it('rejects an invalid reservation', function () {
    $this->postJson('/api/v1/reservations', ['name' => 'a'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['phone', 'reservation_date', 'reservation_time', 'guest_count']);
});

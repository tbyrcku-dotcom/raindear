<?php

use App\Http\Controllers\Api\V1\Admin\AdminContactMessageController;
use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AdminEventInquiryController;
use App\Http\Controllers\Api\V1\Admin\AdminGalleryAssetController;
use App\Http\Controllers\Api\V1\Admin\AdminMenuCategoryController;
use App\Http\Controllers\Api\V1\Admin\AdminMenuItemController;
use App\Http\Controllers\Api\V1\Admin\AdminOpeningHourController;
use App\Http\Controllers\Api\V1\Admin\AdminOutletController;
use App\Http\Controllers\Api\V1\Admin\AdminPromotionController;
use App\Http\Controllers\Api\V1\Admin\AdminReservationController;
use App\Http\Controllers\Api\V1\Admin\AdminSiteSettingController;
use App\Http\Controllers\Api\V1\Admin\AdminTestimonialController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\EventInquiryController;
use App\Http\Controllers\Api\V1\GalleryController;
use App\Http\Controllers\Api\V1\MenuCategoryController;
use App\Http\Controllers\Api\V1\MenuItemController;
use App\Http\Controllers\Api\V1\OutletController;
use App\Http\Controllers\Api\V1\PromotionController;
use App\Http\Controllers\Api\V1\ReservationController;
use App\Http\Controllers\Api\V1\SiteSettingController;
use App\Http\Controllers\Api\V1\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('health', fn () => ['status' => 'ok']);

    // Public read
    Route::get('outlets', [OutletController::class, 'index']);
    Route::get('outlets/{slug}', [OutletController::class, 'show']);
    Route::get('menu-categories', [MenuCategoryController::class, 'index']);
    Route::get('menu-items', [MenuItemController::class, 'index']);
    Route::get('menu-items/{slug}', [MenuItemController::class, 'show']);
    Route::get('gallery', [GalleryController::class, 'index']);
    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::get('promotions', [PromotionController::class, 'index']);
    Route::get('site-settings', [SiteSettingController::class, 'index']);

    // Public form submissions (rate limited)
    Route::middleware('throttle:6,1')->group(function () {
        Route::post('reservations', [ReservationController::class, 'store']);
        Route::post('event-inquiries', [EventInquiryController::class, 'store']);
        Route::post('contact-messages', [ContactMessageController::class, 'store']);
    });

    // Admin auth
    Route::prefix('admin')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:6,1');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::get('dashboard', AdminDashboardController::class);

            Route::apiResource('menu-categories', AdminMenuCategoryController::class);
            Route::apiResource('menu-items', AdminMenuItemController::class);
            Route::apiResource('gallery-assets', AdminGalleryAssetController::class);
            Route::apiResource('testimonials', AdminTestimonialController::class);
            Route::apiResource('promotions', AdminPromotionController::class);
            Route::apiResource('outlets', AdminOutletController::class);
            Route::apiResource('opening-hours', AdminOpeningHourController::class)->except(['show']);
            Route::apiResource('site-settings', AdminSiteSettingController::class);

            // Status-update only endpoints
            Route::get('reservations', [AdminReservationController::class, 'index']);
            Route::get('reservations/{reservation}', [AdminReservationController::class, 'show']);
            Route::patch('reservations/{reservation}', [AdminReservationController::class, 'update']);

            Route::get('event-inquiries', [AdminEventInquiryController::class, 'index']);
            Route::get('event-inquiries/{event_inquiry}', [AdminEventInquiryController::class, 'show']);
            Route::patch('event-inquiries/{event_inquiry}', [AdminEventInquiryController::class, 'update']);

            Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
            Route::get('contact-messages/{contact_message}', [AdminContactMessageController::class, 'show']);
            Route::patch('contact-messages/{contact_message}', [AdminContactMessageController::class, 'update']);
        });
    });
});

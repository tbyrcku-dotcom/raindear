<?php

use Illuminate\Support\Facades\Route;

// SPA catch-all: serve the React shell for any non-API GET route.
Route::view('/{any?}', 'app')->where('any', '^(?!api).*$')->name('spa');

<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

/**
 * PWA Routes
 * 
 * Service Worker and Manifest routes with proper headers
 * Must be defined before the SPA fallback route
 */
Route::get('/sw.js', function () {
    return response()
        ->file(public_path('sw.js'))
        ->header('Content-Type', 'application/javascript')
        ->header('Service-Worker-Allowed', '/')
        ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
})->name('pwa.service-worker');

Route::get('/manifest.json', function () {
    return response()
        ->file(public_path('manifest.json'))
        ->header('Content-Type', 'application/manifest+json')
        ->header('Cache-Control', 'public, max-age=604800');
})->name('pwa.manifest');

/**
 * SPA Fallback Route
 * 
 * All non-API routes will be handled by React Router
 * This allows client-side routing to work properly
 * 
 * Routes handled by React:
 * - /login
 * - /dashboard
 * - /profile
 * - /qr
 * - etc.
 */
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
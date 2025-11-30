<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HistoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
| All routes are prefixed with /api
|
*/

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

/**
 * Login endpoint
 * 
 * POST /api/login
 * Body: { username, password, remember }
 * Returns: { success, message, data: { user, token, expires_at } }
 */
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required)
|--------------------------------------------------------------------------
|
| All routes below require Bearer token in Authorization header
| Middleware: auth:sanctum
|
*/

Route::middleware('auth:sanctum')->group(function () {
    
    /*
    |--------------------------------------------------------------------------
    | Authentication Routes
    |--------------------------------------------------------------------------
    */
    
    /**
     * Get authenticated user data
     * 
     * GET /api/user
     * Headers: Authorization: Bearer {token}
     * Returns: { success, data: { user details } }
     */
    Route::get('/user', [AuthController::class, 'user'])->name('api.user');
    
    /**
     * Logout endpoint
     * 
     * POST /api/logout
     * Headers: Authorization: Bearer {token}
     * Returns: { success, message }
     */
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    
    /*
    |--------------------------------------------------------------------------
    | Profile Routes
    |--------------------------------------------------------------------------
    */
    
    /**
     * Get user profile
     * 
     * GET /api/profile
     * Headers: Authorization: Bearer {token}
     * Returns: { success, data: { profile details } }
     */
    Route::get('/profile', [ProfileController::class, 'show'])->name('api.profile.show');
    
    /**
     * Update user profile
     * 
     * PUT /api/profile
     * Headers: Authorization: Bearer {token}
     * Body: { editable fields }
     * Returns: { success, message, data: { updated profile } }
     */
    Route::put('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
    
    /**
     * Get QR code data
     * 
     * GET /api/profile/qr
     * Headers: Authorization: Bearer {token}
     * Returns: { success, data: { person_id, full_name } }
     */
    Route::get('/profile/qr', [ProfileController::class, 'qr'])->name('api.profile.qr');
    
    /*
    |--------------------------------------------------------------------------
    | Custom Fields Routes
    |--------------------------------------------------------------------------
    */
    
    /**
     * Get custom field definitions and dropdown options
     * 
     * GET /api/custom-fields
     * Headers: Authorization: Bearer {token}
     * Returns: { success, data: { fields, dropdown_options } }
     */
    Route::get('/custom-fields', [ProfileController::class, 'customFields'])->name('api.custom-fields');

    /*
    |--------------------------------------------------------------------------
    | History Routes
    |--------------------------------------------------------------------------
    */
    
    /**
     * Get user's event history
     * 
     * GET /api/history
     * Headers: Authorization: Bearer {token}
     * Returns: { success, data: { history details } }
     */
    Route::get('/history', [HistoryController::class, 'show'])->name('api.history.show');
});

/*
|--------------------------------------------------------------------------
| Fallback Route
|--------------------------------------------------------------------------
|
| This route handles 404 for API endpoints
|
*/

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found',
    ], 404);
});
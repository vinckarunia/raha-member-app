<?php

namespace App\Http\Controllers;

use App\Services\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

/**
 * Profile Controller
 * 
 * Handles HTTP requests for profile operations.
 * Delegates business logic to ProfileService.
 * 
 * Endpoints:
 * - GET /api/profile - Get user profile
 * - PUT /api/profile - Update user profile
 * - GET /api/profile/qr - Get QR code data
 * - GET /api/custom-fields - Get custom field definitions
 * 
 * @package App\Http\Controllers
 * @author 
 */
class ProfileController extends Controller
{
    /**
     * Profile service instance
     *
     * @var ProfileService
     */
    private ProfileService $profileService;

    /**
     * Constructor
     * 
     * Injects ProfileService dependency
     *
     * @param ProfileService $profileService
     */
    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Get profile endpoint
     * 
     * Returns complete profile data for authenticated user.
     * Includes personal information, address, contact, and custom fields.
     * 
     * Headers Required:
     * Authorization: Bearer {token}
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "data": {
     *     "id": number,
     *     "personal": {...},
     *     "address": {...},
     *     "contact": {...},
     *     "custom_fields": {...},
     *     "audit": {...}
     *   }
     * }
     * 
     * @param Request $request HTTP request with authenticated user
     * @return JsonResponse JSON response
     */
    public function show(Request $request): JsonResponse
    {
        try {
            // Get authenticated user's person ID
            $personId = $request->user()->usr_per_ID;

            // Get profile data
            $profile = $this->profileService->getProfile($personId);

            // Return success response
            return response()->json([
                'success' => true,
                'data' => $profile,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Profile not found
            return response()->json([
                'success' => false,
                'message' => 'Profile not found.',
            ], 404);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching profile.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update profile endpoint
     * 
     * Updates editable profile fields for authenticated user.
     * Only address and contact fields can be updated.
     * 
     * Headers Required:
     * Authorization: Bearer {token}
     * 
     * Request Body:
     * {
     *   "per_Address1": "string",
     *   "per_Address2": "string",
     *   "per_City": "string",
     *   "per_State": "string",
     *   "per_Zip": "string",
     *   "per_HomePhone": "string",
     *   "per_CellPhone": "string",
     *   "per_Email": "email",
     * }
     * 
     * Note: All fields are optional. Only provided fields will be updated.
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "message": "Profile updated successfully",
     *   "data": {...}
     * }
     * 
     * Response Error (422):
     * {
     *   "success": false,
     *   "message": "Validation failed",
     *   "errors": {...}
     * }
     * 
     * @param Request $request HTTP request with update data
     * @return JsonResponse JSON response
     */
    public function update(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validated = $request->validate([
                'per_Address1' => 'nullable|string|max:255',
                'per_Address2' => 'nullable|string|max:255',
                'per_City' => 'nullable|string|max:100',
                'per_State' => 'nullable|string|max:100',
                'per_Zip' => 'nullable|string|max:20',
                'per_HomePhone' => 'nullable|string|max:30',
                'per_CellPhone' => 'nullable|string|max:30',
                'per_Email' => 'nullable|email|max:100',
            ]);

            // Get authenticated user
            $user = $request->user();
            $personId = $user->usr_per_ID;

            // Update profile
            $profile = $this->profileService->updateProfile(
                $personId,
                $validated,
                $user->usr_per_ID // Editor ID
            );

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $profile,
            ], 200);

        } catch (ValidationException $e) {
            // Return validation error response
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Profile not found
            return response()->json([
                'success' => false,
                'message' => 'Profile not found.',
            ], 404);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating profile.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get QR code data endpoint
     * 
     * Returns person ID for QR code generation.
     * Frontend will use this ID to generate QR code.
     * 
     * Headers Required:
     * Authorization: Bearer {token}
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "data": {
     *     "person_id": "string",
     *     "full_name": "string",
     *     "member_number": "string",
     *   }
     * }
     * 
     * @param Request $request HTTP request with authenticated user
     * @return JsonResponse JSON response
     */
    public function qr(Request $request): JsonResponse
    {
        try {
            // Get authenticated user
            $user = $request->user();

            // Load person relationship if not loaded
            $user->loadMissing('person.customFields');

            // Return QR data
            return response()->json([
                'success' => true,
                'data' => [
                    'person_id' => (string) $user->usr_per_ID,
                    'full_name' => $user->person->full_name,
                    'member_number' => $user->person->customFields?->c1 ?? null,
                ],
            ], 200);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating QR data.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get custom field definitions endpoint
     * 
     * Returns metadata about custom fields including labels and dropdown options.
     * Used by frontend to render forms with proper labels and options.
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "data": {
     *     "fields": {...},
     *     "dropdown_options": {...}
     *   }
     * }
     * 
     * @return JsonResponse JSON response
     */
    public function customFields(): JsonResponse
    {
        try {
            // Get custom field definitions
            $definitions = $this->profileService->getCustomFieldDefinitions();

            // Return success response
            return response()->json([
                'success' => true,
                'data' => $definitions,
            ], 200);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching custom field definitions.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
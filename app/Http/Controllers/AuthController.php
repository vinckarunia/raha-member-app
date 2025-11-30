<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication operations.
 * Delegates business logic to AuthService.
 * 
 * Endpoints:
 * - POST /api/login - User login
 * - POST /api/logout - User logout
 * - GET /api/user - Get authenticated user data
 * 
 * @package App\Http\Controllers
 * @author GKI Raha DBAJ Development Team
 */
class AuthController extends Controller
{
    /**
     * Authentication service instance
     *
     * @var AuthService
     */
    private AuthService $authService;

    /**
     * Constructor
     * 
     * Injects AuthService dependency
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login endpoint
     * 
     * Authenticates user with username and password.
     * Returns user data and access token on success.
     * 
     * Request Body:
     * {
     *   "username": "string",
     *   "password": "string",
     *   "remember": boolean (optional, default: false)
     * }
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "message": "Login successful",
     *   "data": {
     *     "user": {...},
     *     "token": "string",
     *     "expires_at": "ISO8601 datetime"
     *   }
     * }
     * 
     * Response Error (422):
     * {
     *   "success": false,
     *   "message": "The provided credentials are incorrect.",
     *   "errors": {...}
     * }
     * 
     * @param Request $request HTTP request
     * @return JsonResponse JSON response
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validated = $request->validate([
                'username' => 'required|string',
                'password' => 'required|string',
                'remember' => 'boolean',
            ]);

            // Attempt login
            $result = $this->authService->login(
                $validated['username'],
                $validated['password'],
                $validated['remember'] ?? false
            );

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => $result,
            ], 200);

        } catch (ValidationException $e) {
            // Return validation error response
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are incorrect.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Return generic error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during login.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Logout endpoint
     * 
     * Logs out authenticated user by revoking current access token.
     * User must provide valid token in Authorization header.
     * 
     * Headers Required:
     * Authorization: Bearer {token}
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "message": "Logout successful"
     * }
     * 
     * Response Error (401):
     * {
     *   "message": "Unauthenticated."
     * }
     * 
     * @param Request $request HTTP request with authenticated user
     * @return JsonResponse JSON response
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Get authenticated user from request
            $user = $request->user();

            // Logout user (revoke token)
            $this->authService->logout($user);

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ], 200);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during logout.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get authenticated user endpoint
     * 
     * Returns current authenticated user data.
     * Used by frontend to verify token and get user info.
     * 
     * Headers Required:
     * Authorization: Bearer {token}
     * 
     * Response Success (200):
     * {
     *   "success": true,
     *   "data": {
     *     "id": number,
     *     "username": "string",
     *     "is_admin": boolean,
     *     "person": {...}
     *   }
     * }
     * 
     * Response Error (401):
     * {
     *   "message": "Unauthenticated."
     * }
     * 
     * @param Request $request HTTP request with authenticated user
     * @return JsonResponse JSON response
     */
    public function user(Request $request): JsonResponse
    {
        try {
            // Get authenticated user from request
            $user = $request->user();

            // Get formatted user data
            $userData = $this->authService->getAuthenticatedUser($user);

            // Return success response
            return response()->json([
                'success' => true,
                'data' => $userData,
            ], 200);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching user data.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
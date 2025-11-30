<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Authentication Service
 * 
 * Handles user authentication logic including login, logout, and token management.
 * Uses Laravel Sanctum for API token-based authentication.
 * Implements ChurchCRM's password hashing method (SHA256 with per_ID as salt).
 * 
 * @package App\Services
 * @author GKI Raha DBAJ Development Team
 */
class AuthService
{
    /**
     * Token name for Sanctum API tokens
     * Used to identify tokens created by this application
     * 
     * @var string
     */
    private const TOKEN_NAME = 'portal-jemaat-token';

    /**
     * Authenticate user and create access token
     * 
     * Process:
     * 1. Find user by username
     * 2. Verify password using ChurchCRM's hashing method
     * 3. Create Sanctum API token
     * 4. Record login attempt
     * 5. Load user relationships
     * 
     * @param string $username Username from login form
     * @param string $password Plain text password
     * @param bool $remember Whether to remember the user (extends token lifetime)
     * @return array Contains user data and access token
     * @throws ValidationException If credentials are invalid
     */
    public function login(string $username, string $password, bool $remember = false): array
    {
        // Find user by username
        $user = User::where('usr_UserName', $username)->first();

        // Check if user exists
        if (!$user) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Verify password using ChurchCRM's method: sha256(password + per_ID)
        if (!$user->verifyPassword($password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user needs password change
        // Note: This is not enforced in Phase 1, but flagged for future enhancement
        if ($user->usr_NeedPasswordChange) {
            // Future: Redirect to password change page
            // For now, we allow login
        }

        // Delete existing tokens for this user (force single session)
        // Comment this line if you want to allow multiple concurrent sessions
        $user->tokens()->delete();

        // Create new Sanctum token
        // Token abilities can be customized based on user role
        $abilities = $this->getTokenAbilities($user);
        
        // Set token expiration based on remember me
        $expiresAt = $remember 
            ? now()->addWeeks(2)  // 2 weeks for remember me
            : now()->addHours(24); // 24 hours for regular login
        
        $token = $user->createToken(
            self::TOKEN_NAME,
            $abilities,
            $expiresAt
        );

        // Record login activity
        $user->recordLogin();

        // Load user relationships for response
        $user->load(['person', 'person.customFields']);

        return [
            'user' => $this->formatUserData($user),
            'token' => $token->plainTextToken,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }

    /**
     * Logout user and revoke access token
     * 
     * Deletes the current access token used for the request.
     * User will need to login again to get a new token.
     * 
     * @param User $user Authenticated user
     * @return bool Always returns true
     */
    public function logout(User $user): bool
    {
        // Revoke current token
        // $user->currentAccessToken() returns the token used for current request
        $user->currentAccessToken()->delete();

        return true;
    }

    /**
     * Logout from all devices
     * 
     * Deletes all access tokens for the user.
     * Useful when user wants to logout from all sessions.
     * 
     * @param User $user Authenticated user
     * @return bool Always returns true
     */
    public function logoutFromAllDevices(User $user): bool
    {
        // Delete all tokens
        $user->tokens()->delete();

        return true;
    }

    /**
     * Get authenticated user data
     * 
     * Returns formatted user data with person information.
     * Used for /api/user endpoint to get current user info.
     * 
     * @param User $user Authenticated user
     * @return array Formatted user data
     */
    public function getAuthenticatedUser(User $user): array
    {
        // Load relationships if not already loaded
        $user->loadMissing(['person', 'person.customFields']);

        return $this->formatUserData($user);
    }

    /**
     * Format user data for API response
     * 
     * Structures user data in a consistent format for frontend consumption.
     * Includes personal information and custom fields.
     * 
     * @param User $user User model with loaded relationships
     * @return array Formatted user data
     */
    private function formatUserData(User $user): array
    {
        $person = $user->person;
        $customFields = $person->customFields;

        return [
            'id' => $user->usr_per_ID,
            'username' => $user->usr_UserName,
            'is_admin' => $user->isAdmin(),
            'last_login' => $user->usr_LastLogin?->toIso8601String(),
            'login_count' => $user->usr_LoginCount,
            'person' => [
                'id' => $person->per_ID,
                'title' => $person->per_Title,
                'first_name' => $person->per_FirstName,
                'middle_name' => $person->per_MiddleName,
                'last_name' => $person->per_LastName,
                'suffix' => $person->per_Suffix,
                'full_name' => $person->full_name,
                'gender' => $person->per_Gender,
                'gender_label' => $person->gender_label,
                'birth_date' => $person->birth_date,
                'age' => $person->age,
                'address' => [
                    'line1' => $person->per_Address1,
                    'line2' => $person->per_Address2,
                    'city' => $person->per_City,
                    'state' => $person->per_State,
                    'zip' => $person->per_Zip,
                    'country' => $person->per_Country,
                    'full' => $person->full_address,
                ],
                'contact' => [
                    'home_phone' => $person->per_HomePhone,
                    'cell_phone' => $person->per_CellPhone,
                    'email' => $person->per_Email,
                ],
                'social' => [
                    'facebook' => $person->per_Facebook,
                    'twitter' => $person->per_Twitter,
                    'linkedin' => $person->per_LinkedIn,
                ],
                'membership_date' => $person->per_MembershipDate?->format('Y-m-d'),
                'custom_fields' => $customFields ? $customFields->getFormattedFields() : null,
            ],
        ];
    }

    /**
     * Get token abilities based on user role
     * 
     * Defines what actions a token can perform.
     * Admin users get additional abilities.
     * 
     * @param User $user User to check role
     * @return array List of abilities
     */
    private function getTokenAbilities(User $user): array
    {
        $abilities = [
            'profile:read',
            'profile:update',
            'qr:read',
        ];

        // Add admin abilities if user is admin
        if ($user->isAdmin()) {
            $abilities[] = 'admin:access';
        }

        return $abilities;
    }

    /**
     * Verify if token has specific ability
     * 
     * Used in middleware or controllers to check token permissions.
     * 
     * @param User $user Authenticated user
     * @param string $ability Ability to check
     * @return bool True if token has ability
     */
    public function hasAbility(User $user, string $ability): bool
    {
        return $user->currentAccessToken()->can($ability);
    }
}
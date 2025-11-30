<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User Model
 * 
 * Maps to the user_usr table in ChurchCRM database.
 * Handles authentication and user management for church members.
 * 
 * @package App\Models
 * @author GKI Raha DBAJ Development Team
 * 
 * @property int $usr_per_ID Primary key and foreign key to person_per
 * @property string $usr_Password SHA256 hashed password (password + per_ID)
 * @property string $usr_UserName Username for login
 * @property int $usr_NeedPasswordChange Flag if user needs to change password
 * @property string $usr_LastLogin Last login timestamp
 * @property int $usr_LoginCount Total login count
 * @property int $usr_Admin Admin flag (1 = admin, 0 = regular user)
 * 
 * @relationship person belongsTo Person model
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     * ChurchCRM uses user_usr table for authentication
     *
     * @var string
     */
    protected $table = 'user_usr';

    /**
     * The primary key for the model.
     * ChurchCRM uses usr_per_ID as primary key which also references person_per
     *
     * @var string
     */
    protected $primaryKey = 'usr_per_ID';

    /**
     * Indicates if the model should be timestamped.
     * ChurchCRM doesn't use Laravel's created_at/updated_at
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usr_UserName',
        'usr_Password',
        'usr_LastLogin',
        'usr_LoginCount',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Password should never be exposed in API responses
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'usr_Password',
        'usr_apiKey',
        'usr_TwoFactorAuthSecret',
        'usr_TwoFactorAuthRecoveryCodes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'usr_LastLogin' => 'datetime',
        'usr_NeedPasswordChange' => 'boolean',
        'usr_Admin' => 'boolean',
        'usr_LoginCount' => 'integer',
    ];

    /**
     * Get the password field name for authentication
     * Override default 'password' to use ChurchCRM's field name
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->usr_Password;
    }

    /**
     * Get the unique identifier for the user.
     *
     * This value is stored in the session by Laravel as `user_id`.
     * It must be an integer for default Laravel session table.
     *
     * @return int The primary key of the user (usr_per_ID)
     */
    public function getAuthIdentifier()
    {
        return $this->usr_per_ID;
    }
    
    /**
     * Get the username field name for authentication
     * Override default 'email' to use ChurchCRM's username field
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'usr_UserName';
    }

    /**
     * Relationship: User belongs to a Person
     * Each user account is linked to one person record
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function person()
    {
        return $this->belongsTo(Person::class, 'usr_per_ID', 'per_ID');
    }

    /**
     * Get the person ID for this user
     * Used as salt for password hashing
     * 
     * @return int
     */
    public function getPersonId(): int
    {
        return $this->usr_per_ID;
    }

    /**
     * Hash password using ChurchCRM's method
     * Formula: sha256(password + per_ID)
     * 
     * @param string $password Plain text password
     * @return string Hashed password
     */
    public function hashPassword(string $password): string
    {
        return hash('sha256', $password . $this->getPersonId());
    }

    /**
     * Verify if provided password matches stored password
     * 
     * @param string $password Plain text password to verify
     * @return bool True if password matches
     */
    public function verifyPassword(string $password): bool
    {
        return $this->hashPassword($password) === $this->usr_Password;
    }

    /**
     * Check if user is an administrator
     * 
     * @return bool True if user has admin privileges
     */
    public function isAdmin(): bool
    {
        return $this->usr_Admin === 1;
    }

    /**
     * Increment login count and update last login timestamp
     * Called after successful authentication
     * 
     * @return void
     */
    public function recordLogin(): void
    {
        $this->usr_LoginCount = ($this->usr_LoginCount ?? 0) + 1;
        $this->usr_LastLogin = now();
        $this->save();
    }
}
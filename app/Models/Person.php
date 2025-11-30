<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Person Model
 * 
 * Maps to the person_per table in ChurchCRM database.
 * Contains personal information for all church members.
 * 
 * @package App\Models
 * @author GKI Raha DBAJ Development Team
 * 
 * @property int $per_ID Primary key
 * @property string $per_Title Title (Mr, Mrs, etc)
 * @property string $per_FirstName First name
 * @property string $per_MiddleName Middle name
 * @property string $per_LastName Last name
 * @property string $per_Suffix Suffix (Jr, Sr, etc)
 * @property string $per_Address1 Address line 1
 * @property string $per_Address2 Address line 2
 * @property string $per_City City
 * @property string $per_State State/Province
 * @property string $per_Zip Postal code
 * @property string $per_Country Country
 * @property string $per_HomePhone Home phone number
 * @property string $per_CellPhone Cell/Mobile phone number
 * @property string $per_Email Primary email address
 * @property int $per_BirthMonth Birth month (1-12)
 * @property int $per_BirthDay Birth day (1-31)
 * @property int $per_BirthYear Birth year
 * @property string $per_MembershipDate Membership date
 * @property int $per_Gender Gender (0=unknown, 1=male, 2=female)
 * @property int $per_fmr_ID Family role ID
 * @property int $per_cls_ID Classification ID
 * @property int $per_fam_ID Family ID
 * @property string $per_DateLastEdited Last edit timestamp
 * @property string $per_DateEntered Creation timestamp
 * @property int $per_EnteredBy User ID who created record
 * @property int $per_EditedBy User ID who last edited record
 * @property string $per_Facebook Facebook profile
 * @property string $per_Twitter Twitter handle
 * @property string $per_LinkedIn LinkedIn profile
 * 
 * @relationship customFields hasOne PersonCustom model
 * @relationship user hasOne User model
 */
class Person extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'person_per';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'per_ID';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     * Only editable fields should be listed here for security
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Address fields - user can edit
        'per_Address1',
        'per_Address2',
        'per_City',
        'per_State',
        'per_Zip',
        
        // Contact fields - user can edit
        'per_HomePhone',
        'per_CellPhone',
        'per_Email',
        
        // Audit fields - system managed
        'per_DateLastEdited',
        'per_EditedBy',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'per_BirthMonth' => 'integer',
        'per_BirthDay' => 'integer',
        'per_BirthYear' => 'integer',
        'per_Gender' => 'integer',
        'per_DateLastEdited' => 'datetime',
        'per_DateEntered' => 'datetime',
        'per_MembershipDate' => 'date',
    ];

    /**
     * Relationship: Person has one set of custom fields
     * Links to person_custom table containing custom field values
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function customFields()
    {
        return $this->hasOne(PersonCustom::class, 'per_ID', 'per_ID');
    }

    /**
     * Relationship: Person has one user account (optional)
     * Not all persons have user accounts
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        return $this->hasOne(User::class, 'usr_per_ID', 'per_ID');
    }

    /**
     * Get full name of the person
     * Combines first, middle, and last name
     * 
     * @return string Full name
     */
    public function getFullNameAttribute(): string
    {
        $parts = array_filter([
            $this->per_FirstName,
            $this->per_MiddleName,
            $this->per_LastName,
        ]);
        
        return implode(' ', $parts);
    }

    /**
     * Get formatted birthdate
     * Returns null if birth date is not complete
     * 
     * @return string|null Formatted birthdate (Y-m-d)
     */
    public function getBirthDateAttribute(): ?Carbon
    {
        if ($this->per_BirthYear && $this->per_BirthMonth && $this->per_BirthDay) {
            return Carbon::createFromDate(
                $this->per_BirthYear,
                $this->per_BirthMonth,
                $this->per_BirthDay
            );
        }
        
        return null;
    }

    /**
     * Get age in years
     * Returns null if birth date is not available
     * 
     * @return int|null Age in years
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->birth_date) {
            return null;
        }
        
        return $this->birth_date->diffInYears(now());
    }

    /**
     * Get formatted full address
     * Combines all address fields into one string
     * 
     * @return string|null Formatted address
     */
    public function getFullAddressAttribute(): ?string
    {
        $parts = array_filter([
            $this->per_Address1,
            $this->per_Address2,
            $this->per_City,
            $this->per_State,
            $this->per_Zip,
            $this->per_Country,
        ]);
        
        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * Get gender label
     * Converts numeric gender code to readable label
     * 
     * @return string Gender label
     */
    public function getGenderLabelAttribute(): string
    {
        return match($this->per_Gender) {
            1 => 'Male',
            2 => 'Female',
            default => '',
        };
    }

    /**
     * Record edit action
     * Updates edit timestamp and editor ID
     * 
     * @param int $editorId User ID who is making the edit
     * @return void
     */
    public function recordEdit(int $editorId): void
    {
        $this->per_DateLastEdited = now();
        $this->per_EditedBy = $editorId;
    }

    /**
     * Check if person has a user account
     * 
     * @return bool True if person has user account
     */
    public function hasUserAccount(): bool
    {
        return $this->user()->exists();
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * PersonCustom Model
 * 
 * Maps to the person_custom table in ChurchCRM database.
 * Contains custom field values for each person (c1-c18).
 * 
 * Custom fields include:
 * - c1: Nomor Anggota (Member Number)
 * - c2: Status Keanggotaan (Membership Status)
 * - c3: Pendidikan (Education)
 * - c4: Pekerjaan (Occupation)
 * - c5: Etnis (Ethnicity)
 * - c6: Tanggal Baptis (Baptism Date)
 * - c7: Tanggal Sidi (Confirmation Date)
 * - c8: Tgl. Atestasi Masuk (Transfer In Date)
 * - c9: Tgl. Atestasi Keluar (Transfer Out Date)
 * - c10: Tanggal Meninggal (Death Date)
 * - c11: Tanggal DKH
 * - c12: Tanggal Ex. DKH
 * - c13: Tanggal Ex. DKH-4
 * - c14: Alasan-1 Mutasi (Transfer Reason 1)
 * - c15: Alasan-2 Mutasi (Transfer Reason 2)
 * - c16: Alasan-3 Mutasi (Transfer Reason 3)
 * - c17: Wilayah (Region)
 * - c18: Gol. Darah (Blood Type)
 * - c19: Asal Gereja (Church of Origin) - khusus atestasi masuk
 * - c20: Bidang Keahlian (Area of Expertise)
 * 
 * @package App\Models
 * @author GKI Raha DBAJ Development Team
 * 
 * @property int $per_ID Primary key and foreign key to person_per
 * @property string $c1 Nomor Anggota
 * @property int $c2 Status Keanggotaan (dropdown)
 * @property int $c3 Pendidikan (dropdown)
 * @property int $c4 Pekerjaan (dropdown)
 * @property int $c5 Etnis (dropdown)
 * @property string $c6 Tanggal Baptis
 * @property string $c7 Tanggal Sidi
 * @property string $c8 Tgl. Atestasi Masuk
 * @property string $c9 Tgl. Atestasi Keluar
 * @property string $c10 Tanggal Meninggal
 * @property string $c11 Tanggal DKH
 * @property string $c12 Tanggal Ex. DKH
 * @property string $c13 Tanggal Ex. DKH-4
 * @property int $c14 Alasan-1 Mutasi (dropdown)
 * @property int $c15 Alasan-2 Mutasi (dropdown)
 * @property int $c16 Alasan-3 Mutasi (dropdown)
 * @property int $c17 Wilayah (dropdown)
 * @property int $c18 Gol. Darah (dropdown)
 * @property string $c19 Asal Gereja - Atestasi Masuk
 * @property string $c20 Bidang Keahlian (dropdown)
 * 
 * @relationship person belongsTo Person model
 */
class PersonCustom extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'person_custom';

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
     * Currently all custom fields are read-only for users
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Currently no fields are user-editable
        // Admin can edit through ChurchCRM interface
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'c2' => 'integer',  // Status Keanggotaan
        'c3' => 'integer',  // Pendidikan
        'c4' => 'integer',  // Pekerjaan
        'c5' => 'integer',  // Etnis
        'c6' => 'date',     // Tanggal Baptis
        'c7' => 'date',     // Tanggal Sidi
        'c8' => 'date',     // Tgl. Atestasi Masuk
        'c9' => 'date',     // Tgl. Atestasi Keluar
        'c10' => 'date',    // Tanggal Meninggal
        'c11' => 'date',    // Tanggal DKH
        'c12' => 'date',    // Tanggal Ex. DKH
        'c13' => 'date',    // Tanggal Ex. DKH-4
        'c14' => 'integer', // Alasan-1 Mutasi
        'c15' => 'integer', // Alasan-2 Mutasi
        'c16' => 'integer', // Alasan-3 Mutasi
        'c17' => 'integer', // Wilayah
        'c18' => 'integer', // Gol. Darah
        'c20' => 'integer', // Bidang Keahlian
    ];

    /**
     * Relationship: PersonCustom belongs to a Person
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function person()
    {
        return $this->belongsTo(Person::class, 'per_ID', 'per_ID');
    }

    /**
     * Get dropdown option label for a specific field
     * 
     * @param string $field Field name (c2, c3, c4, etc.)
     * @return string|null Option label or null if not found
     */
    public function getDropdownLabel(string $field): ?string
    {
        $optionId = $this->$field;

        if (!$optionId) {
            return null;
        }

        // Mapping field → list_id
        $fieldToListId = [
            'c2' => 24,
            'c3' => 25,
            'c4' => 26,
            'c5' => 27,
            'c14' => 28,
            'c15' => 29,
            'c16' => 30,
            'c17' => 31,
            'c18' => 32,
            'c20' => 41,
        ];

        if (!isset($fieldToListId[$field])) {
            return null;
        }

        $listId = $fieldToListId[$field];

        $option = ListOption::where('lst_OptionID', $optionId)
                            ->where('lst_ID', $listId)
                            ->first();

        return $option ? $option->lst_OptionName : null;
    }

    /**
     * Get all dropdown fields with their labels
     * Returns array of field => label pairs
     * 
     * @return array<string, string|null>
     */
    public function getDropdownLabels(): array
    {
        // Fields that use dropdown options
        $dropdownFields = ['c2', 'c3', 'c4', 'c5', 'c14', 'c15', 'c16', 'c17', 'c18', 'c20'];
        
        $labels = [];
        
        foreach ($dropdownFields as $field) {
            $labels[$field] = $this->getDropdownLabel($field);
        }
        
        return $labels;
    }

    /**
     * Get formatted custom fields with field names
     * Returns array with readable field names and values
     * 
     * @return array<string, mixed>
     */
    public function getFormattedFields(): array
    {
        return [
            'member_number' => $this->c1,
            'membership_status' => $this->getDropdownLabel('c2'),
            'education' => $this->getDropdownLabel('c3'),
            'occupation' => $this->getDropdownLabel('c4'),
            'ethnicity' => $this->getDropdownLabel('c5'),
            'baptism_date' => $this->c6?->format('Y-m-d'),
            'confirmation_date' => $this->c7?->format('Y-m-d'),
            'transfer_in_date' => $this->c8?->format('Y-m-d'),
            'transfer_out_date' => $this->c9?->format('Y-m-d'),
            'death_date' => $this->c10?->format('Y-m-d'),
            'dkh_date' => $this->c11?->format('Y-m-d'),
            'ex_dkh_date' => $this->c12?->format('Y-m-d'),
            'ex_dkh4_date' => $this->c13?->format('Y-m-d'),
            'transfer_reason_1' => $this->getDropdownLabel('c14'),
            'transfer_reason_2' => $this->getDropdownLabel('c15'),
            'transfer_reason_3' => $this->getDropdownLabel('c16'),
            'region' => $this->getDropdownLabel('c17'),
            'blood_type' => $this->getDropdownLabel('c18'),
            'church_before' => $this->c19,
            'expertise' => $this->getDropdownLabel('c20'),
        ];
    }
}
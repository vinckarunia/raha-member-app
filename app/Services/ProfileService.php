<?php

namespace App\Services;

use App\Models\Person;
use App\Models\ListOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Profile Service
 * 
 * Handles profile data retrieval and updates for church members.
 * Manages editable fields (address, phone, email) and read-only fields.
 * Maintains data integrity and audit logs.
 * 
 * @package App\Services
 * @author GKI Raha DBAJ Development Team
 */
class ProfileService
{
    /**
     * Fields that users are allowed to edit themselves
     * Only contact and address information can be updated by users
     * 
     * @var array<string>
     */
    private const EDITABLE_FIELDS = [
        'per_Address1',
        'per_Address2',
        'per_City',
        'per_State',
        'per_Zip',
        'per_HomePhone',
        'per_CellPhone',
        'per_Email',
    ];

    /**
     * Get complete profile data for a person
     * 
     * Retrieves all personal information including custom fields.
     * Custom dropdown fields are resolved to their labels.
     * 
     * @param int $personId Person ID
     * @return array Complete profile data
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If person not found
     */
    public function getProfile(int $personId): array
    {
        // Find person with relationships
        $person = Person::with(['customFields'])
            ->findOrFail($personId);

        return $this->formatProfileData($person);
    }

    /**
     * Update editable profile fields
     * 
     * Process:
     * 1. Validate that only editable fields are being updated
     * 2. Filter out empty/null values (preserve existing data)
     * 3. Update person record with new values
     * 4. Record edit timestamp and editor ID
     * 5. Return updated profile data
     * 
     * @param int $personId Person ID to update
     * @param array $data Data to update
     * @param int $editorId User ID who is making the edit
     * @return array Updated profile data
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If person not found
     * @throws \InvalidArgumentException If non-editable fields are included
     */
    public function updateProfile(int $personId, array $data, int $editorId): array
    {
        // Find person
        $person = Person::with(['customFields'])
            ->findOrFail($personId);

        // Start database transaction for data consistency
        DB::beginTransaction();

        try {
            // Filter data to only include editable fields
            $updateData = $this->filterEditableFields($data);

            // Remove empty values to avoid overwriting with null
            // Users might leave some fields unchanged
            $updateData = array_filter($updateData, function ($value) {
                return $value !== null && $value !== '';
            });

            // Record who made the edit and when
            $person->recordEdit($editorId);

            // Update person record
            $person->fill($updateData);
            $person->save();

            // Commit transaction
            DB::commit();

            // Log successful update
            Log::info('Profile updated', [
                'person_id' => $personId,
                'editor_id' => $editorId,
                'fields_updated' => array_keys($updateData),
            ]);

            // Return updated profile
            return $this->formatProfileData($person->fresh(['customFields']));

        } catch (\Exception $e) {
            // Rollback on error
            DB::rollBack();

            // Log error
            Log::error('Profile update failed', [
                'person_id' => $personId,
                'editor_id' => $editorId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Get custom field definitions and options
     * 
     * Returns metadata about custom fields including:
     * - Field names and labels
     * - Dropdown options for fields that use them
     * - Field types (text, date, dropdown)
     * 
     * Used by frontend to render forms and display labels correctly.
     * 
     * @return array Custom field definitions
     */
    public function getCustomFieldDefinitions(): array
    {
        return [
            'fields' => [
                'c1' => [
                    'name' => 'member_number',
                    'label' => 'Nomor Anggota',
                    'label_en' => 'Member Number',
                    'type' => 'text',
                    'editable' => false,
                ],
                'c2' => [
                    'name' => 'membership_status',
                    'label' => 'Status Keanggotaan',
                    'label_en' => 'Membership Status',
                    'type' => 'dropdown',
                    'list_id' => 24,
                    'editable' => false,
                ],
                'c3' => [
                    'name' => 'education',
                    'label' => 'Pendidikan',
                    'label_en' => 'Education',
                    'type' => 'dropdown',
                    'list_id' => 25,
                    'editable' => false,
                ],
                'c4' => [
                    'name' => 'occupation',
                    'label' => 'Pekerjaan',
                    'label_en' => 'Occupation',
                    'type' => 'dropdown',
                    'list_id' => 26,
                    'editable' => false,
                ],
                'c5' => [
                    'name' => 'ethnicity',
                    'label' => 'Etnis',
                    'label_en' => 'Ethnicity',
                    'type' => 'dropdown',
                    'list_id' => 27,
                    'editable' => false,
                ],
                'c6' => [
                    'name' => 'baptism_date',
                    'label' => 'Tanggal Baptis',
                    'label_en' => 'Baptism Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c7' => [
                    'name' => 'confirmation_date',
                    'label' => 'Tanggal Sidi',
                    'label_en' => 'Confirmation Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c8' => [
                    'name' => 'transfer_in_date',
                    'label' => 'Tgl. Atestasi Masuk',
                    'label_en' => 'Transfer In Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c9' => [
                    'name' => 'transfer_out_date',
                    'label' => 'Tgl. Atestasi Keluar',
                    'label_en' => 'Transfer Out Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c10' => [
                    'name' => 'death_date',
                    'label' => 'Tanggal Meninggal',
                    'label_en' => 'Death Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c11' => [
                    'name' => 'dkh_date',
                    'label' => 'Tanggal DKH',
                    'label_en' => 'DKH Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c12' => [
                    'name' => 'ex_dkh_date',
                    'label' => 'Tanggal Ex. DKH',
                    'label_en' => 'Ex. DKH Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c13' => [
                    'name' => 'ex_dkh4_date',
                    'label' => 'Tanggal Ex. DKH-4',
                    'label_en' => 'Ex. DKH-4 Date',
                    'type' => 'date',
                    'editable' => false,
                ],
                'c14' => [
                    'name' => 'transfer_reason_1',
                    'label' => 'Alasan-1 Mutasi',
                    'label_en' => 'Transfer Reason 1',
                    'type' => 'dropdown',
                    'list_id' => 28,
                    'editable' => false,
                ],
                'c15' => [
                    'name' => 'transfer_reason_2',
                    'label' => 'Alasan-2 Mutasi',
                    'label_en' => 'Transfer Reason 2',
                    'type' => 'dropdown',
                    'list_id' => 29,
                    'editable' => false,
                ],
                'c16' => [
                    'name' => 'transfer_reason_3',
                    'label' => 'Alasan-3 Mutasi',
                    'label_en' => 'Transfer Reason 3',
                    'type' => 'dropdown',
                    'list_id' => 30,
                    'editable' => false,
                ],
                'c17' => [
                    'name' => 'region',
                    'label' => 'Wilayah',
                    'label_en' => 'Region',
                    'type' => 'dropdown',
                    'list_id' => 31,
                    'editable' => false,
                ],
                'c18' => [
                    'name' => 'blood_type',
                    'label' => 'Gol. Darah',
                    'label_en' => 'Blood Type',
                    'type' => 'dropdown',
                    'list_id' => 32,
                    'editable' => false,
                ],
                'c19' => [
                    'name' => 'church_before',
                    'label' => 'Asal Gereja',
                    'label_en' => 'Church Origin',
                    'type' => 'text',
                    'editable' => false,
                ],
                'c20' => [
                    'name' => 'expertise',
                    'label' => 'Bidang Keahlian',
                    'label_en' => 'Area of Expertise',
                    'type' => 'dropdown',
                    'list_id' => 41,
                    'editable' => false,
                ],
            ],
            'dropdown_options' => $this->getDropdownOptions(),
        ];
    }

    /**
     * Format profile data for API response
     * 
     * Structures profile data consistently with proper field names and labels.
     * Resolves dropdown values to their display labels.
     * Handles null values gracefully.
     * 
     * @param Person $person Person model with loaded relationships
     * @return array Formatted profile data
     */
    private function formatProfileData(Person $person): array
    {
        $customFields = $person->customFields;

        return [
            'id' => $person->per_ID,
            'personal' => [
                'title' => $person->per_Title ?? null,
                'first_name' => $person->per_FirstName,
                'middle_name' => $person->per_MiddleName ?? null,
                'last_name' => $person->per_LastName,
                'suffix' => $person->per_Suffix ?? null,
                'full_name' => $person->full_name,
                'gender' => $person->per_Gender,
                'gender_label' => $person->gender_label,
                'birth_date' => $person->birth_date,
                'age' => $person->age,
                'membership_date' => $person->per_MembershipDate?->format('Y-m-d'),
            ],
            'address' => [
                'line1' => $person->per_Address1 ?? null,
                'line2' => $person->per_Address2 ?? null,
                'city' => $person->per_City ?? null,
                'state' => $person->per_State ?? null,
                'zip' => $person->per_Zip ?? null,
                'country' => $person->per_Country ?? null,
                'full' => $person->full_address,
            ],
            'contact' => [
                'home_phone' => $person->per_HomePhone ?? null,
                'cell_phone' => $person->per_CellPhone ?? null,
                'email' => $person->per_Email ?? null,
            ],
            'social' => [
                'facebook' => $person->per_Facebook ?? null,
                'twitter' => $person->per_Twitter ?? null,
                'linkedin' => $person->per_LinkedIn ?? null,
            ],
            'custom_fields' => $customFields ? $customFields->getFormattedFields() : [],
            'audit' => [
                'created_at' => $person->per_DateEntered?->toIso8601String(),
                'created_by' => $person->per_EnteredBy,
                'updated_at' => $person->per_DateLastEdited?->toIso8601String(),
                'updated_by' => $person->per_EditedBy,
            ],
        ];
    }

    /**
     * Filter data to only include editable fields
     * 
     * Security measure to prevent users from editing restricted fields.
     * Only fields defined in EDITABLE_FIELDS constant are allowed.
     * 
     * @param array $data Raw input data
     * @return array Filtered data with only editable fields
     */
    private function filterEditableFields(array $data): array
    {
        return array_intersect_key(
            $data,
            array_flip(self::EDITABLE_FIELDS)
        );
    }

    /**
     * Get all dropdown options for custom fields
     * 
     * Retrieves dropdown options from list_lst table grouped by list ID.
     * Used by frontend to populate select/dropdown fields.
     * 
     * @return array Dropdown options grouped by list ID
     */
    private function getDropdownOptions(): array
    {
        return ListOption::getAllGrouped();
    }

    /**
     * Get list of editable field names
     * 
     * Returns array of field names that users can edit.
     * Used by frontend to determine which fields to make editable.
     * 
     * @return array List of editable field names
     */
    public function getEditableFields(): array
    {
        return self::EDITABLE_FIELDS;
    }
}
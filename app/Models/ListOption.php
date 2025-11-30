<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ListOption Model
 * 
 * Maps to the list_lst table in ChurchCRM database.
 * Contains dropdown options for custom fields.
 * 
 * Used for custom fields like:
 * - Status Keanggotaan (lst_ID 24)
 * - Pendidikan (lst_ID 25)
 * - Pekerjaan (lst_ID 26)
 * - Etnis (lst_ID 27)
 * - Alasan Mutasi (lst_ID 28, 29, 30)
 * - Wilayah (lst_ID 31)
 * - Gol. Darah (lst_ID 32)
 * 
 * @package App\Models
 * @author GKI Raha DBAJ Development Team
 * 
 * @property int $lst_ID List identifier (group ID)
 * @property int $lst_OptionID Option ID (unique for each option)
 * @property int $lst_OptionSequence Display sequence/order
 * @property string $lst_OptionName Option display name
 * 
 * @scope byListId Filter options by list ID
 * @scope ordered Order by sequence
 */
class ListOption extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'list_lst';

    /**
     * The primary key for the model.
     * This table uses composite key (lst_ID, lst_OptionID)
     * but we use lst_OptionID as primary for simplicity
     *
     * @var string
     */
    protected $primaryKey = 'lst_OptionID';

    /**
     * Indicates if the model should be timestamped.
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
        'lst_ID',
        'lst_OptionID',
        'lst_OptionSequence',
        'lst_OptionName',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'lst_ID' => 'integer',
        'lst_OptionID' => 'integer',
        'lst_OptionSequence' => 'integer',
    ];

    /**
     * Scope: Filter options by list ID
     * 
     * Usage: ListOption::byListId(24)->get()
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $listId List ID to filter
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByListId($query, int $listId)
    {
        return $query->where('lst_ID', $listId);
    }

    /**
     * Scope: Order by sequence
     * 
     * Usage: ListOption::ordered()->get()
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('lst_OptionSequence', 'asc');
    }

    /**
     * Get all options grouped by list ID
     * Returns array with list_id as key and options as value
     * 
     * @return array<int, array>
     */
    public static function getAllGrouped(): array
    {
        $options = self::ordered()->get();
        
        return $options->groupBy('lst_ID')->map(function ($group) {
            return $group->map(function ($option) {
                return [
                    'id' => $option->lst_OptionID,
                    'label' => $option->lst_OptionName,
                    'sequence' => $option->lst_OptionSequence,
                ];
            })->values()->toArray();
        })->toArray();
    }

    /**
     * Get options for specific custom field
     * Maps custom field name to list ID and retrieves options
     * 
     * @param string $customField Custom field name (c2, c3, etc.)
     * @return array<int, array>
     */
    public static function getOptionsForField(string $customField): array
    {
        // Map custom fields to list IDs
        $fieldToListId = [
            'c2' => 24,  // Status Keanggotaan
            'c3' => 25,  // Pendidikan
            'c4' => 26,  // Pekerjaan
            'c5' => 27,  // Etnis
            'c14' => 28, // Alasan-1 Mutasi
            'c15' => 29, // Alasan-2 Mutasi
            'c16' => 30, // Alasan-3 Mutasi
            'c17' => 31, // Wilayah
            'c18' => 32, // Gol. Darah
            'c20' => 41, // Bidang Keahlian
        ];
        
        if (!isset($fieldToListId[$customField])) {
            return [];
        }
        
        $listId = $fieldToListId[$customField];
        
        return self::byListId($listId)
            ->ordered()
            ->get()
            ->map(function ($option) {
                return [
                    'id' => $option->lst_OptionID,
                    'label' => $option->lst_OptionName,
                ];
            })
            ->toArray();
    }

    /**
     * Get field label by option ID
     * 
     * @param int $optionId Option ID to look up
     * @return string|null Option label or null if not found
     */
    public static function getLabelById(int $optionId): ?string
    {
        $option = self::find($optionId);
        
        return $option ? $option->lst_OptionName : null;
    }
}
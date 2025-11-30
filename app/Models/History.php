<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * History Model
 * * Maps to the event_attend table in ChurchCRM database.
 * Represents the attendance record of a person in an event.
 * * @package App\Models
 * @author GKI Raha DBAJ Development Team
 * * @property int $attend_id Primary key
 * @property int $event_id Event ID
 * @property int $person_id Person ID
 * @property string $checkin_date Check-in timestamp
 * @property string $checkout_date Check-out timestamp
 */
class History extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'event_attend';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'attend_id';

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
        'event_id',
        'person_id',
        'checkin_date',
        'checkout_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'event_id' => 'integer',
        'person_id' => 'integer',
        'checkin_date' => 'datetime',
        'checkout_date' => 'datetime',
    ];

    /**
     * Relationship: Attendance belongs to an Event
     * * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    /**
     * Relationship: Attendance belongs to a Person
     * * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'per_id');
    }
}
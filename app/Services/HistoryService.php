<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * History Service
 * * Handles retrieval of historical event attendance data.
 * Executes complex joins between attendance, events, types, and person tables.
 * * @package App\Services
 * @author GKI Raha DBAJ Development Team
 */
class HistoryService
{
    /**
     * Get attendance history for a specific person
     * * Executes the specific query to fetch:
     * - Attendance ID
     * - Event Title
     * - Event Type Name
     * - Person Name
     * * @param int $personId The ID of the person (per_id)
     * @return array List of attendance history
     */
    public function getHistory(int $personId): array
    {
        try {
            // Execute the requested query using Query Builder
            $history = DB::table('event_attend as a')
                ->join('events_event as e', 'a.event_id', '=', 'e.event_id')
                ->join('event_types as t', 'e.event_type', '=', 't.type_id')
                ->join('person_per as p', 'a.person_id', '=', 'p.per_id')
                ->where('a.person_id', $personId)
                ->select([
                    'a.attend_id',
                    'e.event_title',
                    't.type_name',
                    'a.checkin_date'
                ])
                ->orderBy('e.event_start', 'desc') // Optional: Order by most recent event
                ->get();

            return $history->toArray();

        } catch (\Exception $e) {
            Log::error('Failed to fetch history data', [
                'person_id' => $personId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Services\HistoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * History Controller
 * * Handles HTTP requests for retrieving user event history.
 * * Endpoints:
 * - GET /api/history - Get authenticated user's attendance history
 * * @package App\Http\Controllers
 * @author GKI Raha DBAJ Development Team
 */
class HistoryController extends Controller
{
    /**
     * History service instance
     *
     * @var HistoryService
     */
    private HistoryService $historyService;

    /**
     * Constructor
     * * Injects HistoryService dependency
     *
     * @param HistoryService $historyService
     */
    public function __construct(HistoryService $historyService)
    {
        $this->historyService = $historyService;
    }

    /**
     * Get history endpoint
     * * Returns historical event data for the authenticated user.
     * * Headers Required:
     * Authorization: Bearer {token}
     * * Response Success (200):
     * {
     * "success": true,
     * "data": [
     * {
     * "attend_id": 3,
     * "event_title": "Kebaktian Umum 1 2025-08-10",
     * "type_name": "Kebaktian Umum 1",
     * "name": "Vincent Simanjuntak"
     * },
     * ...
     * ]
     * }
     * * @param Request $request HTTP request with authenticated user
     * @return JsonResponse JSON response
     */
    public function show(Request $request): JsonResponse
    {
        try {
            // Get authenticated user's person ID
            $personId = $request->user()->usr_per_ID;

            // Get history data
            $history = $this->historyService->getHistory($personId);

            // Return success response
            return response()->json([
                'success' => true,
                'data' => $history,
            ], 200);

        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching history.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Store a newly created attendance record.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'timestamp' => 'required|date',
            'authenticated' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        $data = $validator->validated();

        // 2. Define HTTA campus coordinates and radius
        $htaLatitude = 8.1567;
        $htaLongitude = 125.1270;
        $allowedRadiusMeters = 100; // 100 meters

        // 3. Perform GPS location validation (Geofencing)
        $locationStatus = 'outside_campus';
        if ($this->isWithinRadius($data['latitude'], $data['longitude'], $htaLatitude, $htaLongitude, $allowedRadiusMeters)) {
            $locationStatus = 'within_campus';
        } else {
            // If location is outside, reject attendance immediately as per scenario
            return response()->json([
                'status' => 'error',
                'message' => 'Location is outside HTTA training area. Please check in from an authorized location.',
                'location_status' => $locationStatus
            ], 403); // Forbidden
        }

        // 4. Create and save the attendance record
        try {
            $attendanceRecord = AttendanceRecord::create([
                'user_id' => $data['user_id'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'timestamp' => $data['timestamp'],
                'authenticated' => $data['authenticated'],
                'location_status' => $locationStatus,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance successfully recorded. Have a great day, ' . $data['user_id'] . '!',
                'record' => $attendanceRecord
            ], 201); // Created
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to record attendance: ' . $e->getMessage()
            ], 500); // Internal Server Error
        }
    }

    /**
     * Helper function to calculate distance between two coordinates (Haversine formula).
     * Returns distance in meters.
     */
    private function isWithinRadius($lat1, $lon1, $lat2, $lon2, $radiusMeters)
    {
        $earthRadius = 6371000; // meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return $distance <= $radiusMeters;
    }
}

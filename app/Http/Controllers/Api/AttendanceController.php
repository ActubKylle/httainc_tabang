<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Learner;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display the attendance management page.
     */
    public function index(Request $request)
    {
        $request->validate([
            'program_id' => 'sometimes|integer|exists:programs,id',
            'date' => 'sometimes|date_format:Y-m-d',
        ]);

        $programs = Program::where('status', 'active')->orderBy('course_name')->get(['id', 'course_name']);
        $students = collect([]);

        $selectedProgramId = $request->input('program_id');
        $selectedDate = $request->input('date', now()->format('Y-m-d'));

        if ($selectedProgramId) {
            // Fetch learners enrolled in the selected program
            $learners = Learner::where('enrollment_status', 'accepted')
                ->whereHas('courseEnrollments', function ($query) use ($selectedProgramId) {
                    $query->where('program_id', $selectedProgramId);
                })
                ->with(['user:id,name,email'])
                ->orderBy('last_name')
                ->get();
            
            // Get existing attendance records for these learners on the selected date
            $existingAttendance = Attendance::where('attendance_date', $selectedDate)
                ->whereIn('learner_id', $learners->pluck('learner_id'))
                ->get()
                ->keyBy('learner_id');

            // Map learner data with their attendance status for the UI
            $students = $learners->map(function ($learner) use ($existingAttendance, $selectedDate) {
                $attendanceRecord = $existingAttendance->get($learner->learner_id);
                return [
                    'learner_id' => $learner->learner_id,
                    'name' => $learner->first_name . ' ' . $learner->last_name,
                    'email' => $learner->user->email ?? 'N/A',
                    'status' => $attendanceRecord->status ?? null, // 'present', 'absent', etc.
                    'time_in' => $attendanceRecord?->time_in?->format('H:i:s'),
                    'time_out' => $attendanceRecord?->time_out?->format('H:i:s'),
                    'remarks' => $attendanceRecord->remarks ?? '',
                ];
            });
        }
        
        return Inertia::render('Staff/Attendance/Index', [
            'programs' => $programs,
            'students' => $students,
            'filters' => [
                'program_id' => $selectedProgramId,
                'date' => $selectedDate,
            ],
        ]);
    }

    /**
     * Store or update attendance records.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|integer|exists:programs,id',
            'attendance_date' => 'required|date_format:Y-m-d',
            'attendances' => 'required|array',
            'attendances.*.learner_id' => 'required|integer|exists:learners,learner_id',
            'attendances.*.status' => 'required|string|in:present,absent,excused,left_early',
            'attendances.*.remarks' => 'nullable|string|max:255',
            'attendances.*.time_in' => 'nullable', // No validation, set on server
            'attendances.*.time_out' => 'nullable', // No validation, set on server
        ]);

        $staffId = Auth::id();
        $now = now();

        foreach ($validated['attendances'] as $attendanceData) {
            $existingRecord = Attendance::where('learner_id', $attendanceData['learner_id'])
                                        ->where('attendance_date', $validated['attendance_date'])
                                        ->first();

            $updateData = [
                'program_id' => $validated['program_id'],
                'marked_by_id' => $staffId,
                'status' => $attendanceData['status'],
                'remarks' => $attendanceData['remarks'],
            ];

            // Logic for setting time_in and time_out
            if ($attendanceData['status'] === 'present' && !$existingRecord?->time_in) {
                $updateData['time_in'] = $now;
            }

            // This part assumes a separate action for time-out.
            // For simplicity, we'll handle it here if status changes.
            if ($attendanceData['status'] === 'left_early' && $existingRecord?->time_in && !$existingRecord?->time_out) {
                 $updateData['time_out'] = $now;
            } elseif ($attendanceData['status'] === 'absent' || $attendanceData['status'] === 'excused') {
                $updateData['time_in'] = null;
                $updateData['time_out'] = null;
            }

            Attendance::updateOrCreate(
                [
                    'learner_id' => $attendanceData['learner_id'],
                    'attendance_date' => $validated['attendance_date'],
                ],
                $updateData
            );
        }

        return redirect()->back()->with('success', 'Attendance submitted successfully.');
    }
}
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
        // Add validation for the new batch_id
        $request->validate([
            'program_id' => 'sometimes|integer|exists:programs,id',
            'batch_id' => 'sometimes|integer|exists:batches,id', // New validation
            'date' => 'sometimes|date_format:Y-m-d',
        ]);

        $programs = Program::where('status', 'active')->orderBy('course_name')->get(['id', 'course_name']);
        $students = collect([]);

        $selectedProgramId = $request->input('program_id');
        $selectedBatchId = $request->input('batch_id'); // Get the batch_id from the request
        $selectedDate = $request->input('date', now()->format('Y-m-d'));

        // --- MODIFIED LOGIC ---
        // Only fetch students if BOTH program and batch are selected.
        if ($selectedProgramId && $selectedBatchId) {
            // Fetch learners enrolled in the selected program AND batch
            $learners = Learner::where('enrollment_status', 'accepted')
                ->whereHas('courseEnrollments', function ($query) use ($selectedProgramId, $selectedBatchId) {
                    $query->where('program_id', $selectedProgramId)
                          ->where('batch_id', $selectedBatchId); // Filter by batch_id
                })
                ->with(['user:id,name,email'])
                ->orderBy('last_name')
                ->get();
            
            // Get existing attendance records (this part is still correct)
            $existingAttendance = Attendance::where('attendance_date', $selectedDate)
                ->whereIn('learner_id', $learners->pluck('learner_id'))
                ->get()
                ->keyBy('learner_id');

            // Map learner data (this part is still correct)
            $students = $learners->map(function ($learner) use ($existingAttendance) {
                $attendanceRecord = $existingAttendance->get($learner->learner_id);
                return [
                    'learner_id' => $learner->learner_id,
                    'name' => $learner->first_name . ' ' . $learner->last_name,
                    'email' => $learner->user->email ?? 'N/A',
                    'status' => $attendanceRecord->status ?? null,
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
                'batch_id' => $selectedBatchId, // Pass batch_id back to the view
                'date' => $selectedDate,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|integer|exists:programs,id',
            'batch_id' => 'required|integer|exists:batches,id', // Add batch_id to validation
            'attendance_date' => 'required|date_format:Y-m-d',
            'attendances' => 'required|array',
            'attendances.*.learner_id' => 'required|integer|exists:learners,learner_id',
            'attendances.*.status' => 'required|string|in:present,absent,excused,left_early',
            'attendances.*.remarks' => 'nullable|string|max:255',
        ]);

        $staffId = Auth::id();
        $now = now();

        foreach ($validated['attendances'] as $attendanceData) {
            $existingRecord = Attendance::where('learner_id', $attendanceData['learner_id'])
                                        ->where('attendance_date', $validated['attendance_date'])
                                        ->first();

            $updateData = [
                'program_id' => $validated['program_id'],
                'batch_id' => $validated['batch_id'], 
                'marked_by_id' => $staffId,
                'status' => $attendanceData['status'],
                'remarks' => $attendanceData['remarks'],
            ];

            if ($attendanceData['status'] === 'present' && !$existingRecord?->time_in) {
                $updateData['time_in'] = $now;
            }

            if ($attendanceData['status'] === 'left_early' && $existingRecord?->time_in && !$existingRecord?->time_out) {
                 $updateData['time_out'] = $now;
            } elseif (in_array($attendanceData['status'], ['absent', 'excused'])) {
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
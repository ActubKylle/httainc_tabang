<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Learner;
use App\Models\Program;
use App\Models\Scholarship;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DashboardController extends Controller
{
    /**
     * Display the staff dashboard with dynamic data.
     */
    public function index()
    {
        // 1. Fetch Key Performance Indicators (KPIs) - (Code from before is unchanged)
        $stats = [
            'pendingLearners' => Learner::where('enrollment_status', 'pending')->count(),
            'totalStudents' => Learner::where('enrollment_status', 'accepted')->count(),
            'activePrograms' => Program::where('status', 'active')->count(),
            'pendingScholarships' => DB::table('student_scholarships')->where('status', 'Applied')->count(),
        ];

        // 2. --- START: ENHANCED ENROLLMENT TRENDS LOGIC ---
        
        // Step A: Get the actual enrollment data from the DB
        $dbData = Learner::query()
            ->select(
                DB::raw('COUNT(learner_id) as students'),
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key")
            )
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth()) // Go back 5 months to get a 6-month period
            ->groupBy('month_key')
            ->pluck('students', 'month_key'); // Creates an associative array ['2025-07' => 8]

        // Step B: Create a complete 6-month period to ensure all months are present
        $period = CarbonPeriod::create(now()->subMonths(5)->startOfMonth(), '1 month', now()->endOfMonth());
        
        $enrollmentTrends = [];

        // Step C: Loop through the complete period and fill with data, defaulting to 0
        foreach ($period as $date) {
            $monthKey = $date->format('Y-m'); // e.g., "2025-07"
            $enrollmentTrends[] = [
                'month' => $date->format('M'), // e.g., "Jul"
                'students' => $dbData[$monthKey] ?? 0, // Use data from DB, or 0 if not exists
            ];
        }
        // --- END: ENHANCED ENROLLMENT TRENDS LOGIC ---
        
        // 3. Fetch Course Distribution data - (Code from before is unchanged)
        $courseDistribution = Program::withCount(['learners' => function ($query) {
                $query->where('enrollment_status', 'accepted');
            }])
            ->having('learners_count', '>', 0)
            ->orderBy('learners_count', 'desc')
            ->get(['course_name as name', 'learners_count as value']);
        
        $colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
        $courseDistribution->each(function($item, $key) use ($colors) {
            $item->color = $colors[$key % count($colors)];
        });

        // 4. Fetch Recent Activities - (Code from before is unchanged)
        $recentPendingLearners = Learner::with('courseEnrollments.program')
            ->where('enrollment_status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($learner) {
                return [
                    'learner_id' => $learner->learner_id,
                    'name' => $learner->first_name . ' ' . $learner->last_name,
                    'program' => optional(optional($learner->courseEnrollments)->first())->program->course_name ?? 'N/A',
                    'date' => $learner->created_at->diffForHumans(),
                ];
            });

        // 5. Render the Inertia component with all the fetched data
        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats,
            'enrollmentTrends' => $enrollmentTrends,
            'courseDistribution' => $courseDistribution,
            'recentPendingLearners' => $recentPendingLearners,
        ]);
    }
}
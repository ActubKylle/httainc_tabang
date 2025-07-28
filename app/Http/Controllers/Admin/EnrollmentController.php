<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner;
use App\Models\User;
use App\Models\Program; // Import Program model
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrollmentAccepted;
use Illuminate\Support\Facades\Storage;

class EnrollmentController extends Controller
{
    /**
     * Display the admin enrollment list with recent learner registrations.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        // Eager load necessary relationships
        // Load courseEnrollments.program to get program details
        $query = Learner::with(['address', 'user', 'courseEnrollments.program', 'registrationSignature']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('email', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($status && in_array($status, ['pending', 'accepted', 'rejected'])) {
            $query->where('enrollment_status', $status);
        }

        $recentLearners = $query->orderBy('created_at', 'desc')
                                ->paginate(10)
                                ->through(function ($learner) {
                                    $programName = $learner->courseEnrollments->first() && $learner->courseEnrollments->first()->program
                                        ? $learner->courseEnrollments->first()->program->course_name 
                                        : 'N/A';

                                    $pictureImageUrl = null;
                                    if ($learner->registrationSignature && $learner->registrationSignature->picture_image_path) {
                                        $dbPath = $learner->registrationSignature->picture_image_path;
                                        $pictureImageUrl = Storage::url($dbPath);
                                    }

                                    return [
                                        'learner_id' => $learner->learner_id,
                                        'first_name' => $learner->first_name,
                                        'last_name' => $learner->last_name,
                                        'email' => $learner->user->email ?? 'N/A',
                                        'contact_no' => $learner->address->contact_no ?? 'N/A',
                                        'program_name' => $programName, // Changed from course_qualification to program_name
                                        'created_at' => $learner->created_at,
                                        'enrollment_status' => $learner->enrollment_status,
                                        'address' => $learner->address,
                                        'user' => $learner->user,
                                        'picture_image_url' => $pictureImageUrl,
                                    ];
                                });

        return Inertia::render('Admin/Enrollments', [
            'recentLearners' => $recentLearners,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

   
    public function show(Learner $learner)
    {
        $learner->load([
            'user',
            'address',
            'educationalAttainment',
            'classifications',
            'disabilities.disabilityType',
            'courseEnrollments.program', 
            'privacyConsent',
            'registrationSignature'
        ]);

       
        if ($learner->registrationSignature) {
            if ($learner->registrationSignature->picture_image_path) {
                $learner->registrationSignature->picture_image_path = Storage::url($learner->registrationSignature->picture_image_path);
            }
            if ($learner->registrationSignature->thumbmark_image_path) {
                $learner->registrationSignature->thumbmark_image_path = Storage::url($learner->registrationSignature->thumbmark_image_path);
            }
        }

        return Inertia::render('Admin/EnrollmentDetails', [
            'learner' => $learner,
        ]);
    }


    /**
     * Accept a learner's enrollment.
     */
    public function accept(Learner $learner)
    {
        // Prevent re-processing if already accepted or rejected
        if ($learner->enrollment_status !== 'pending') {
            return redirect()->back()->with('error', 'Enrollment has already been processed.');
        }

        // Ensure the learner has an associated user
        if (!$learner->user) {
            return redirect()->back()->with('error', 'No associated user found for this learner.');
        }

        // Generate a random password for the user
        $randomPassword = Str::random(10); // Generates a 10-character random string

        // Update the user's password and role
        $user = $learner->user;
        $user->password = Hash::make($randomPassword);
        $user->role = 'learner'; // Assign the 'learner' role
        $user->save();

        // Update the learner's enrollment status
        $learner->update(['enrollment_status' => 'accepted']);

        // Send email to the student with their new credentials
        try {
            Mail::to($user->email)->send(new EnrollmentAccepted(
                $learner->first_name,
                $learner->last_name,
                $user->email, // Using email as username
                $randomPassword
            ));
            return redirect()->route('admin.enrollments')->with('success', 'Learner accepted and email sent with credentials.');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Failed to send enrollment acceptance email: ' . $e->getMessage());
            return redirect()->route('admin.enrollments')->with('warning', 'Learner accepted, but email sending failed. Please check mail configuration.');
        }
    }

    /**
     * Reject a learner's enrollment.
     */
    public function reject(Learner $learner)
    {
        // Prevent re-processing if already accepted or rejected
        if ($learner->enrollment_status !== 'pending') {
            return redirect()->back()->with('error', 'Enrollment has already been processed.');
        }

        // Update the learner's enrollment status
        $learner->update(['enrollment_status' => 'rejected']);

        // Optionally, you could send a rejection email here if desired.
        // For example: Mail::to($learner->user->email)->send(new EnrollmentRejected($learner->first_name, $learner->last_name));

        return redirect()->route('admin.enrollments')->with('success', 'Learner enrollment rejected.');
    }



  public function studentList(Request $request)
{
    $query = Learner::with(['address', 'user', 'courseEnrollments.program', 'registrationSignature'])
                    ->where('enrollment_status', 'accepted');

    // --- Apply Filters ---
    $search = $request->input('search');
    $programFilter = $request->input('program');
    // $scholarshipFilter = $request->input('scholarship');

    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', '%' . $search . '%')
              ->orWhere('last_name', 'like', '%' . $search . '%')
              ->orWhereHas('user', function ($uq) use ($search) {
                  $uq->where('email', 'like', '%' . $search . '%');
              });
        });
    }

    if ($programFilter) {
        $query->whereHas('courseEnrollments.program', function ($q) use ($programFilter) {
            $q->where('course_name', $programFilter);
        });
    }

    // if ($scholarshipFilter) {
    //     // This assumes you have a 'scholarships' relationship on the Learner model
    //     $query->whereHas('scholarships', function ($q) use ($scholarshipFilter) {
    //         $q->where('scholarship_name', $scholarshipFilter);
    //     });
    // }


$students = $query->orderBy('last_name', 'asc')
    ->paginate(15)
    ->through(function ($learner) {
        // This closure now formats each student record consistently
        return [
            'learner_id' => $learner->learner_id,
            'first_name' => $learner->first_name,
            'last_name' => $learner->last_name,
            'email' => $learner->user->email ?? 'N/A',
            'picture_image_url' => $learner->registrationSignature ? Storage::url($learner->registrationSignature->picture_image_path) : null,
            
            // This line specifically fixes the missing program name
            'program_name' => $learner->courseEnrollments->first() && $learner->courseEnrollments->first()->program
                ? $learner->courseEnrollments->first()->program->course_name
                : 'N/A',

            // This line specifically fixes the missing contact number
            'contact_no' => $learner->address->contact_no ?? 'N/A',
            
            // Add any other fields your frontend needs
            'enrollment_status' => 'Enrolled', // Or use $learner->enrollment_status if you change the query
            'attendance_summary' => '98%', // Placeholder
        ];
    });

    // --- START: NEW LOGIC TO PASS DATA TO THE VIEW ---

    // Fetch all unique program names for the filter dropdown
    $programs = Program::orderBy('course_name')->pluck('course_name')->unique()->all();
    
    // Fetch all unique scholarship names for the filter dropdown
    // This assumes a 'Scholarship' model and a 'scholarship_name' column
    // $scholarships = Scholarship::orderBy('scholarship_name')->pluck('scholarship_name')->unique()->all();

    // // Calculate stats
    // $stats = [
    //     'activeScholars' => Learner::where('enrollment_status', 'accepted')->whereHas('scholarships')->count(),
    //     'forAssessment' => Learner::where('enrollment_status', 'accepted')->whereHas('assessmentProfiles', function($q){
    //         $q->where('status', 'Pending');
    //     })->count(),
    // ];


    // Modify the return statement
    return Inertia::render('Admin/StudentList', [
        'students' => $students,
        // 'stats' => $stats, // Pass the new stats
        'filters' => $request->only(['search', 'program', 'scholarship']),
        'programs' => Program::orderBy('course_name')->pluck('course_name')->unique()->all(),
        // 'scholarships' => $scholarships, // Pass the scholarship list
    ]);
    // --- END: NEW LOGIC ---
}


}
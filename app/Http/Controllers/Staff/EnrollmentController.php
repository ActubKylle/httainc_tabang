<?php

namespace App\Http\Controllers\Staff;
use Illuminate\Http\Request; 

use App\Http\Controllers\Controller;
use App\Models\Learner;
use App\Models\User;
use App\Models\Program; // Import Program model
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrollmentAccepted;
use Barryvdh\DomPDF\Facade\Pdf;
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

                                        $cleanPath = str_replace('storage/', '', $dbPath);
                                        $pictureImageUrl = Storage::url($cleanPath); 
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

        return Inertia::render('Staff/Enrollments', [
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

        return Inertia::render('Staff/EnrollmentDetails', [
            'learner' => $learner,
        ]);
    }



     public function edit(Learner $learner)
    {
        // Load all the same data you need for the details page
        $learner->load([
            'user', 'address', 'educationalAttainment', 'classifications',
            'disabilities.disabilityType', 'courseEnrollments.program',
            'privacyConsent', 'registrationSignature'
        ]);

        // Render a NEW Inertia component for the edit page
        return Inertia::render('Staff/EnrollmentEdit', [
            'learner' => $learner,
        ]);
    }

    /**
     * Update the specified learner in storage.
     */
    public function update(Request $request, Learner $learner)
    {
        // 1. Validate the incoming data (add all fields you want to edit)
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'civil_status' => 'required|string|max:20',
            'contact_no' => ['required', 'string', 'max:20', 'regex:/^\+?639\d{2}-?\d{3}-?\d{4}$/'],
            'email' => 'required|email|max:255',
            // Add validation rules for any other fields in your form
        ]);

        // 2. Update the learner and related models
        $learner->update([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'],
            'civil_status' => $validatedData['civil_status'],
        ]);

        // Update the related address model
        if ($learner->address) {
            $learner->address()->update([
                'contact_no' => $validatedData['contact_no'],
            ]);
        }

        // Update the related user model
        if ($learner->user) {
            $learner->user()->update([
                'email' => $validatedData['email'],
                'name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
            ]);
        }

        // 3. Redirect back to the details page with a success message
        return redirect()->route('staff.enrollment.show', $learner->learner_id)
                         ->with('success', 'Learner details updated successfully!');
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
            return redirect()->route('staff.enrollments')->with('success', 'Learner accepted and email sent with credentials.');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Failed to send enrollment acceptance email: ' . $e->getMessage());
            return redirect()->route('staff.enrollments')->with('warning', 'Learner accepted, but email sending failed. Please check mail configuration.');
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

        return redirect()->route('staff.enrollments')->with('success', 'Learner enrollment rejected.');
    }



  public function studentList(Request $request)
    {
        $query = Learner::where('enrollment_status', 'accepted')
            ->with([
                'address:learner_id,contact_no', 
                'user:id,email', 
                'courseEnrollments.program:id,course_name', 
                'registrationSignature:learner_id,picture_image_path'
            ])
            // --- ADD THIS TO EFFICIENTLY COUNT ATTENDANCE ---
            ->withCount([
                'attendances', // Total days marked
                'attendances as present_count' => function ($query) {
                    $query->where('status', 'present'); // Days marked 'present'
                }
            ]);

        // --- Apply Filters ---
        $search = $request->input('search');
        $programFilter = $request->input('program');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('email', 'like', "%{$search}%"));
            });
        }

        if ($programFilter) {
            $query->whereHas('courseEnrollments.program', fn($q) => $q->where('course_name', $programFilter));
        }

        $students = $query->orderBy('last_name', 'asc')
            ->paginate(15)
            ->through(function ($learner) {
                
                // --- DYNAMIC ATTENDANCE SUMMARY LOGIC ---
                $totalDays = $learner->attendances_count;
                $presentDays = $learner->present_count;
                $attendanceSummary = 'Not yet recorded'; // Default value

                if ($totalDays > 0) {
                    $percentage = round(($presentDays / $totalDays) * 100);
                    $attendanceSummary = "{$presentDays}/{$totalDays} Days ({$percentage}%)";
                }

                return [
                    'learner_id' => $learner->learner_id,
                    'first_name' => $learner->first_name,
                    'last_name' => $learner->last_name,
                    'email' => $learner->user->email ?? 'N/A',
                    'picture_image_url' => $learner->registrationSignature ? Storage::url($learner->registrationSignature->picture_image_path) : null,
                    'program_name' => $learner->courseEnrollments->first()?->program->course_name ?? 'N/A',
                    'contact_no' => $learner->address->contact_no ?? 'N/A',
                    'enrollment_status' => 'Enrolled',
                    'attendance_summary' => $attendanceSummary, // The new dynamic value
                ];
            });

        return Inertia::render('Staff/StudentList', [
            'students' => $students,
            'filters' => $request->only(['search', 'program']),
            'programs' => Program::orderBy('course_name')->pluck('course_name')->unique()->all(),
        ]);
    }

  public function downloadPdf(Learner $learner)
    {
        // 1. Load all the same data you need for the details page
        $learner->load([
            'user', 'address', 'educationalAttainment', 'classifications',
            'disabilities.disabilityType', 'courseEnrollments.program',
            'privacyConsent', 'registrationSignature'
        ]);

        // Make sure the image paths are accessible URLs for the PDF
        if ($learner->registrationSignature) {
            if ($learner->registrationSignature->picture_image_path) {
                // Use the full path on the server for the PDF renderer
                $learner->registrationSignature->picture_image_path_full = public_path(Storage::url($learner->registrationSignature->picture_image_path));
            }
            if ($learner->registrationSignature->thumbmark_image_path) {
                $learner->registrationSignature->thumbmark_image_path_full = public_path(Storage::url($learner->registrationSignature->thumbmark_image_path));
            }
        }


        // 2. Prepare the data for the view
        $data = [
            'learner' => $learner
        ];

        // 3. Load the view and generate the PDF
        $pdf = Pdf::loadView('pdfs.learner_registration', $data);

        // 4. (Optional) Set paper size and orientation if needed
        $pdf->setPaper('a4', 'portrait');

        // 5. Stream the PDF to the browser for download
        return $pdf->stream('Learner-Registration-Form-' . $learner->last_name . '.pdf');
    }


}
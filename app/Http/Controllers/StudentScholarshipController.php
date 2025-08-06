<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\Learner;
use App\Models\ScholarshipApplicationDocument; // Import the new model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // Import DB for transactions

class StudentScholarshipController extends Controller
{
    /**
     * Display a listing of scholarships for students.
     */
    public function index()
    {
        $learner = auth()->user()->learner;

        $availableScholarships = Scholarship::where('status', 'Open')
            ->where('application_deadline', '>', now())
            ->orderBy('application_deadline', 'asc')
            ->get();

        $appliedScholarshipIds = $learner->scholarships()->pluck('scholarships.scholarship_id')->toArray();

        return Inertia::render('Student/Scholarships/Index', [
            'availableScholarships' => $availableScholarships,
            'appliedScholarshipIds' => $appliedScholarshipIds,
        ]);
    }

    /**
     * Show the application form for a specific scholarship.
     */
    public function showApplicationForm(Scholarship $scholarship)
    {
        if ($scholarship->status !== 'Open' || $scholarship->application_deadline <= now()) {
            return redirect()->route('student.scholarships.index')
                ->with('error', 'This scholarship is no longer accepting applications.');
        }

        $learner = auth()->user()->learner;
        if ($learner && $scholarship->learners()->where('learners.learner_id', $learner->learner_id)->exists()) {
            return redirect()->route('student.scholarships.index')
                ->with('error', 'You have already applied for this scholarship.');
        }

        return Inertia::render('Student/Scholarships/Apply', [
            'scholarship' => $scholarship,
            'learner' => $learner,
        ]);
    }

    /**
     * Store a scholarship application.
     */
    public function storeApplication(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'birth_certificate' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'transcript_of_records' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'formal_photo' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'parent_id' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'marriage_contract' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $learner = auth()->user()->learner;

        // --- UPDATED LOGIC ---
        // Use a database transaction to ensure data integrity.
        DB::transaction(function () use ($request, $scholarship, $learner) {
            // 1. Store uploaded files and get their paths
            $paths = [];
            $fileFields = ['birth_certificate', 'transcript_of_records', 'formal_photo', 'parent_id', 'marriage_contract'];
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $filename = $learner->learner_id . '_' . time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $paths[$field . '_path'] = $file->storeAs('scholarship_documents/' . $learner->learner_id, $filename, 'public');
                }
            }

            // 2. Create the main application record in the pivot table.
            $scholarship->learners()->attach($learner->learner_id, [
                'application_date' => now(),
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // 3. Get the ID of the pivot record we just created.
            $pivotRecord = DB::table('student_scholarships')
                            ->where('learner_id', $learner->learner_id)
                            ->where('scholarship_id', $scholarship->scholarship_id)
                            ->latest('created_at') // Get the most recent application
                            ->first();

            // 4. Create the document record in the new table, linked to the pivot record.
            if ($pivotRecord) {
                 ScholarshipApplicationDocument::create([
                    'student_scholarship_id' => $pivotRecord->student_scholarship_id,
                    'birth_certificate_path' => $paths['birth_certificate_path'] ?? null,
                    'transcript_of_records_path' => $paths['transcript_of_records_path'] ?? null,
                    'formal_photo_path' => $paths['formal_photo_path'] ?? null,
                    'parent_id_path' => $paths['parent_id_path'] ?? null,
                    'marriage_contract_path' => $paths['marriage_contract_path'] ?? null,
                ]);
            } else {
                // If the pivot record can't be found, roll back the transaction.
                throw new \Exception("Could not find the application record to attach documents.");
            }
        });

        return redirect()->route('student.scholarships.index')
            ->with('success', 'Your scholarship application has been submitted successfully!');
    }

    public function myApplications()
    {
        $learner = auth()->user()->learner;

        // Eager load the 'scholarships' relationship for the current learner.
        // The withPivot() method on your Learner model's relationship
        // ensures that status, remarks, etc., are included.
        $applications = $learner->scholarships()->orderBy('pivot_created_at', 'desc')->get();

        return Inertia::render('Student/Scholarships/MyApplications', [
            'applications' => $applications,
        ]);
    }

    
}

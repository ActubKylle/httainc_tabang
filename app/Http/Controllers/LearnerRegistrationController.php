<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Learner;
use App\Models\User; // Still needed for type hinting, but not for creation here
use App\Models\Classification;
use App\Models\Program;
use App\Models\DisabilityType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // Still needed for hashing if used elsewhere, but not for new user here
use Illuminate\Support\Str; // Still needed for string functions if used elsewhere, but not for new password here
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class LearnerRegistrationController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // --- 1. Validation ---
            $validatedData = $request->validate([
                'last_name' => 'required|string|max:50',
                'first_name' => 'required|string|max:50',
                'middle_name' => 'nullable|string|max:50',
                'extension_name' => 'nullable|string|max:10',
                'gender' => 'required|string|in:Male,Female',
                'civil_status' => 'required|string|max:20',
                'birth_date' => 'required|date',
                'age' => 'required|integer|min:1|max:150',
                'birthplace_city_municipality' => 'nullable|string|max:100',
                'birthplace_province' => 'nullable|string|max:100',
                'birthplace_region' => 'nullable|string|max:100',
                'nationality' => 'required|string|max:50',
                'employment_status' => 'nullable|string|max:50',
                'employment_type' => 'nullable|string|max:50',
                'parent_guardian_name' => 'nullable|string|max:100',
                'parent_guardian_mailing_address' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email', // Email still unique to prevent duplicate user accounts later
                'number_street' => 'required|string|max:255',
                'city_municipality' => 'required|string|max:100',
                'barangay' => 'required|string|max:100',
                'district' => 'nullable|string|max:100',
                'province' => 'required|string|max:100',
                'region' => 'required|string|max:100',
                'facebook_account' => 'nullable|string|max:255|url',
                'contact_no' => 'required|string|max:20',

                // Educational Attainments (BOOLEAN FLAGS)
                'no_grade_completed' => 'nullable|boolean',
                'elementary_undergraduate' => 'nullable|boolean',
                'elementary_graduate' => 'nullable|boolean',
                'junior_high_k12' => 'nullable|boolean',
                'senior_high_k12' => 'nullable|boolean',
                'high_school_undergraduate' => 'nullable|boolean',
                'high_school_graduate' => 'nullable|boolean',
                'post_secondary_non_tertiary_technical_vocational_undergraduate' => 'nullable|boolean',
                'post_secondary_non_tertiary_technical_vocational_course_graduate' => 'nullable|boolean',
                'college_undergraduate' => 'nullable|boolean',
                'college_graduate' => 'nullable|boolean',
                'masteral' => 'nullable|boolean',
                'doctorate' => 'nullable|boolean',

                // Classifications:
                'classifications' => 'nullable|array',
                'classifications.*' => 'integer|exists:classifications,id',
                'other_classification_details' => 'nullable|string|max:255|required_if:classifications.*,24',

                // Disability Types:
                'disability_types' => 'nullable|array',
                'disability_types.*' => 'integer|exists:disability_types,id',
                'cause_of_disability' => 'nullable|string|max:50|required_if:disability_types,true',

                 // Program Enrollment: Changed from course_qualification to program_id
                'program_id' => 'required|integer|exists:programs,id', // Validate against 'programs' table and its 'id'
                'scholarship_package' => 'nullable|string|max:255',

                'consent_given' => 'required|boolean|accepted', // Must be true

                'thumbmark_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'picture_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            // --- 2. Handle File Uploads ---
         $thumbmarkImagePath = null;
            if ($request->hasFile('thumbmark_image')) {
                // Store in storage/app/public/thumbmarks and return 'thumbmarks/filename.ext'
                $thumbmarkImagePath = $request->file('thumbmark_image')->store('thumbmarks', 'public');
            }

            $pictureImagePath = null;
            if ($request->hasFile('picture_image')) {
                // Store in storage/app/public/pictures and return 'pictures/filename.ext'
                $pictureImagePath = $request->file('picture_image')->store('pictures', 'public');
                Log::info('Raw path from store(): ' . $pictureImagePath);
            }

            // --- 3. Removed: Generate Password & Create User (This will now happen on admin approval) ---
            // $generatedPassword = Str::random(12);
            // $user = User::create([
            //     'name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
            //     'email' => $validatedData['email'],
            //     'password' => Hash::make($generatedPassword),
            //     'role' => 'learner',
            //     'email_verified_at' => null,
            // ]);

        $user = User::create([
                'name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
                'email' => $validatedData['email'],
                'password' => Hash::make(Str::random(12)), // random password, will be reset on approval
                'role' => 'learner',
                'email_verified_at' => null,
            ]);
      
            // --- 4. Create Learner Record (user_id will be null initially) ---
            $learner = Learner::create([
                'user_id' => $user->id, // Set user_id to null initially
                'entry_date' => now()->toDateString(),
                'last_name' => $validatedData['last_name'],
                'first_name' => $validatedData['first_name'],
                'middle_name' => $validatedData['middle_name'] ?? null,
                'extension_name' => $validatedData['extension_name'] ?? null,
                'gender' => $validatedData['gender'],
                'civil_status' => $validatedData['civil_status'],
                'birth_date' => $validatedData['birth_date'],
                'age' => $validatedData['age'],
                'birthplace_city_municipality' => $validatedData['birthplace_city_municipality'] ?? null,
                'birthplace_province' => $validatedData['birthplace_province'] ?? null,
                'birthplace_region' => $validatedData['birthplace_region'] ?? null,
                'nationality' => $validatedData['nationality'],
                'employment_status' => $validatedData['employment_status'] ?? null,
                'employment_type' => $validatedData['employment_type'] ?? null,
                'parent_guardian_name' => $validatedData['parent_guardian_name'] ?? null,
                'parent_guardian_mailing_address' => $validatedData['parent_guardian_mailing_address'] ?? null,
                't2mis_auto_generated' => true,
                'enrollment_status' => 'pending', // Explicitly set to pending
            ]);
// --- NEW: Create User and link to Learner ---



            // --- 5. Create Related Records ---
            $learner->address()->create([
                'number_street' => $validatedData['number_street'],
                'city_municipality' => $validatedData['city_municipality'],
                'barangay' => $validatedData['barangay'],
                'district' => $validatedData['district'] ?? null,
                'province' => $validatedData['province'],
                'region' => $validatedData['region'],
                'email_address' => $validatedData['email'], // Store email here for later user creation
                'facebook_account' => $validatedData['facebook_account'] ?? null,
                'contact_no' => $validatedData['contact_no'],
            ]);

            // Create Educational Attainment record
            $learner->educationalAttainment()->create([
                'no_grade_completed' => $validatedData['no_grade_completed'] ?? false,
                'elementary_undergraduate' => $validatedData['elementary_undergraduate'] ?? false,
                'elementary_graduate' => $validatedData['elementary_graduate'] ?? false,
                'junior_high_k12' => $validatedData['junior_high_k12'] ?? false,
                'senior_high_k12' => $validatedData['senior_high_k12'] ?? false,
                'high_school_undergraduate' => $validatedData['high_school_undergraduate'] ?? false,
                'high_school_graduate' => $validatedData['high_school_graduate'] ?? false,
                'post_secondary_non_tertiary_technical_vocational_undergraduate' => $validatedData['post_secondary_non_tertiary_technical_vocational_undergraduate'] ?? false,
                'post_secondary_non_tertiary_technical_vocational_course_graduate' => $validatedData['post_secondary_non_tertiary_technical_vocational_course_graduate'] ?? false,
                'college_undergraduate' => $validatedData['college_undergraduate'] ?? false,
                'college_graduate' => $validatedData['college_graduate'] ?? false,
                'masteral' => $validatedData['masteral'] ?? false,
                'doctorate' => $validatedData['doctorate'] ?? false,
            ]);

            // Attach Learner Classifications (Many-to-Many)
            if (!empty($validatedData['classifications'])) {
                $pivotData = [];
                foreach ($validatedData['classifications'] as $classificationId) {
                    $pivotEntry = ['classification_id' => $classificationId];
                    if ($classificationId == 24 && !empty($validatedData['other_classification_details'])) {
                        $pivotEntry['other_classification_details'] = $validatedData['other_classification_details'];
                    } else {
                        $pivotEntry['other_classification_details'] = null;
                    }
                    $pivotData[$classificationId] = $pivotEntry;
                }
                $learner->classifications()->sync($pivotData);
            } else {
                $learner->classifications()->detach();
            }

            // Create Disability records (One-to-Many)
            if (!empty($validatedData['disability_types'])) {
                $causeOfDisability = $validatedData['cause_of_disability'] ?? null;
                $disabilityRecords = [];
                foreach ($validatedData['disability_types'] as $disabilityTypeId) {
                    $disabilityRecords[] = [
                        'disability_type_id' => $disabilityTypeId,
                        'cause_of_disability' => $causeOfDisability,
                    ];
                }
                $learner->disabilities()->delete();
                $learner->disabilities()->createMany($disabilityRecords);
            } else {
                $learner->disabilities()->delete();
            }

            // Create Course Enrollment
            $learner->courseEnrollments()->create([
                'program_id' => $validatedData['program_id'], // Use program_id, linked to the programs table
                'scholarship_package' => $validatedData['scholarship_package'] ?? null,
            ]);

            // Create Privacy Consent
            $learner->privacyConsent()->create([
                'consent_given' => $validatedData['consent_given'],
                'date_agreed' => now()->toDateString(),
            ]);

            // Create Registration Signature (for image paths)
            $learner->registrationSignature()->create([
                'applicant_signature_printed_name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
                'date_accomplished' => now()->toDateString(),
                'thumbmark_image_path' => $thumbmarkImagePath, // This will now be 'public/...'
                'picture_image_path' => $pictureImagePath,     // This will now be 'public/...'

            ]);

            DB::commit();

            // Redirect back to the same page with a success flash message
            return redirect()->back()->with('success_message', 'Registration Submitted! Thank you for registering. Your application has been received and is now waiting for approval by the administrator.');

        } catch (ValidationException $e) {
            DB::rollBack();
            Log::error('Validation failed during learner registration: ' . $e->getMessage(), $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Learner registration failed: ' . $e->getMessage() . ' on line ' . $e->getLine() . ' in ' . $e->getFile());
            return redirect()->back()->withErrors(['registration_error' => 'An internal server error occurred: ' . $e->getMessage() . ' (File: ' . basename($e->getFile()) . ', Line: ' . $e->getLine() . ')'])->withInput();
        }
    }
}

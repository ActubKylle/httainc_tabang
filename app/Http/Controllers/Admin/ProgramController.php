<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program; // Import the Program model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class ProgramController extends Controller
{
    public function __construct()
    {
        // Apply middleware to ensure only authenticated admin users can access these methods.
        // You would typically have a 'role' middleware that checks if user->role === 'admin'.
        // Example: $this->middleware(['auth', 'role:admin']);
        // For now, assuming you have an 'auth' middleware applied to your 'admin' routes group.
    }

    /**
     * Display a listing of the programs for admin management.
     * This will be the main index page for managing programs.
     */
    public function manageIndex(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Program::query(); // Start a query on the Program model

        // Apply search filter if present
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('course_name', 'like', '%' . $search . '%')
                  ->orWhere('qualification_level', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Apply status filter if present
        if ($status && in_array($status, ['active', 'inactive'])) {
            $query->where('status', $status);
        }

        // Paginate the results and order them
        $programs = $query->orderBy('course_name') // Order alphabetically by program name
                          ->paginate(10); // Paginate with 10 items per page

         return Inertia::render('Admin/Programs/Index', [ // <--- This path must be exact
        'programs' => $programs,
        'filters' => [
            'search' => $search,
            'status' => $status,
        ],
    ]);
    }

    /**
     * Show the form for creating a new program.
     */
    public function create()
    {
        return Inertia::render('Admin/Programs/Create');
    }

    /**
     * Store a newly created program in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'course_name' => ['required', 'string', 'max:255', 'unique:programs,course_name'], // Program name must be unique in 'programs' table
            'qualification_level' => ['required', 'string', 'max:50'],
            'duration_hours' => ['required', 'integer', 'min:1'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        try {
            Program::create($validatedData);
            return redirect()->route('admin.programs.manage_index')->with('success', 'Program added successfully.');
        } catch (\Exception $e) {
            Log::error('Error adding program: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to add program. Please try again.']);
        }
    }

    /**
     * Show the form for editing the specified program.
     */
    public function edit(Program $program) // Laravel's route model binding automatically finds the program by ID
    {
        return Inertia::render('Admin/Programs/Edit', [
            'program' => $program,
        ]);
    }

    /**
     * Update the specified program in storage.
     */
    public function update(Request $request, Program $program)
    {
        $validatedData = $request->validate([
            'course_name' => ['required', 'string', 'max:255', Rule::unique('programs', 'course_name')->ignore($program->id)], // Unique rule ignores current program ID
            'qualification_level' => ['required', 'string', 'max:50'],
            'duration_hours' => ['required', 'integer', 'min:1'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ]);

        try {
            $program->update($validatedData);
            return redirect()->route('admin.programs.manage_index')->with('success', 'Program updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating program: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update program. Please try again.']);
        }
    }

    /**
     * Toggle the status of the specified program (active/inactive).
     * This method is used for both activating and deactivating programs.
     */
    public function toggleStatus(Program $program)
    {
        try {
            $newStatus = $program->status === 'active' ? 'inactive' : 'active';
            $program->update(['status' => $newStatus]);

            return redirect()->route('admin.programs.manage_index')->with('success', 'Program status updated successfully to ' . $newStatus . '.');
        } catch (\Exception $e) {
            Log::error('Error toggling program status: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to change program status. Please try again.']);
        }
    }

    // You might also want a method to display publicly available programs
    // This is distinct from the admin management view.
    public function indexPublic()
    {
        $programs = Program::where('status', 'active')->get();
        return Inertia::render('Programs/IndexPublic', [ // Assuming a public programs index page
            'programs' => $programs,
        ]);
    }
}
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\LearnerRegistrationController;
use App\Http\Controllers\Admin\EnrollmentController; // Changed from DashboardController
use App\Http\Controllers\Admin\ProgramController; // Import the ProgramController
// Public Home Page
Route::get('/', [PublicPageController::class, 'home'])->name('public.home');

// Public Pages
Route::get('/about', [PublicPageController::class, 'about'])->name('public.about');
Route::get('/programs', [PublicPageController::class, 'programs'])->name('public.programs');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('public.contact');

Route::get('/enrollnow', [PublicPageController::class, 'enrollNow'])->name('public.enrollnow'); // Added new route

// Route for your Registration Form submission
Route::post('/register/learner', [LearnerRegistrationController::class, 'store'])->name('register.learner');


// Authenticated User Routes (from your starter kit)
Route::middleware(['auth', 'verified'])->group(function () {
   Route::get('/dashboard', function () {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard')
            : Inertia::render('Dashboard');
    })->name('dashboard');

    // Regular user dashboard
    Route::get('/user-dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('user.dashboard');
});

// ADMIN ROUTES - Protected by 'admin' middleware
Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/dashboard'); // This is your general user dashboard
    })->name('admin.dashboard');

Route::get('/trigger-event', function () {
    $data = ['message' => 'Hello, this is a test event!',
              'timestamp' => now()->toDateTimeString()];
              broadcast(new \App\Events\MyEvent($data));
              return 'Event triggered successfully!'; // This is just for testing the event
});
    Route::get('/admin/enrollments', [EnrollmentController::class, 'index'])->name('admin.enrollments'); // Changed route path and name
    // Add other admin-specific routes here (e.g., /admin/learners, /admin/programs)
        Route::get('/admin/enrollments/{learner}', [EnrollmentController::class, 'show'])->name('admin.enrollment.show');
         Route::post('/admin/enrollments/{learner}/accept', [EnrollmentController::class, 'accept'])->name('admin.enrollment.accept'); // New route
    Route::post('/admin/enrollments/{learner}/reject', [EnrollmentController::class, 'reject'])->name('admin.enrollment.reject'); // New route


    // This will be the master list of all accepted students.
Route::get('/admin/students', [EnrollmentController::class, 'studentList'])->name('admin.students.index');
    // Import Students Route
    Route::post('/admin/students/import', [ProgramController::class, 'handleImport'])->name('admin.students.import');

 Route::prefix('admin/programs')->name('admin.programs.')->group(function () {
        Route::get('/', [ProgramController::class, 'manageIndex'])->name('manage_index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create');
        Route::post('/', [ProgramController::class, 'store'])->name('store');
        Route::get('/{program}/edit', [ProgramController::class, 'edit'])->name('edit');
        Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
        Route::post('/{program}/toggle-status', [ProgramController::class, 'toggleStatus'])->name('toggle_status');
    });
    

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
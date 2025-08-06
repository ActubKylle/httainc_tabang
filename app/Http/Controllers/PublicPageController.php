<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicPageController extends Controller
{
    public function home()
    {
        return Inertia::render('Public/Home');
    }

    public function about()
    {
        return Inertia::render('Public/About');
    }

    public function programs()
    {
        return Inertia::render('Public/Programs');
    }
    public function registrationForm()
{
    $programs = \App\Models\Program::where('status', 'active')->orderBy('course_name')->get(['id', 'course_name']);
    return Inertia::render('Public/RegistrationForms', [
        'programs' => $programs,
    ]);
}

    public function contact()
    {
        return Inertia::render('Public/Contact');
    }
 public function enrollNow()
{
    $today = now()->toDateString();

    $programs = \App\Models\Program::where('status', 'active')
        ->where(function ($query) use ($today) {
            $query->where(function ($q) use ($today) {
                // Programs with a start and end date
                $q->where('enrollment_start_date', '<=', $today)
                  ->where('enrollment_end_date', '>=', $today);
            })->orWhere(function ($q) {
                // Programs with no dates set are always open
                $q->whereNull('enrollment_start_date')
                  ->whereNull('enrollment_end_date');
            });
        })
        ->orderBy('course_name')
        // Pass the dates to the frontend
        ->get(['id', 'course_name', 'enrollment_start_date', 'enrollment_end_date']);

    return Inertia::render('Public/EnrollNow', [
        'programs' => $programs,
    ]);
}
}
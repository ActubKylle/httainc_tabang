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
        $programs = \App\Models\Program::where('status', 'active')->orderBy('course_name')->get(['id', 'course_name']);
        return Inertia::render('Public/EnrollNow', [
            'programs' => $programs,
        ]);    }
}
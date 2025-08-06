<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // Import Auth facade

class LearnerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if a user is authenticated
        if (!Auth::check() || Auth::user()->role !== 'learner') {
            // If the user is not authenticated OR their role is not 'admin',
            // then deny access.

            // Option A: Abort with a 403 Forbidden status
            abort(403, 'Unauthorized. You do not have access.');

            // Option B: Redirect to another page (e.g., home or login with a message)
            // return redirect()->route('public.home')->with('error', 'You do not have permission to access that page.');
            // return redirect()->route('login')->with('error', 'Please log in with an administrator account.');
        }

        // If the user is an authenticated admin, allow the request to proceed
        return $next($request);
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckFacultySelection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Skip check for super admin
        if ($user && $user->isSuperAdmin()) {
            return $next($request);
        }

        // Check if user has selected a faculty
        if (!session('selected_faculty_id')) {
            // Redirect to faculty selection page
            return redirect()->route('faculty.selection');
        }

        // Verify that the selected faculty is accessible to the user
        if (!$user->hasFacultyAccess(session('selected_faculty_id'))) {
            // Clear invalid selection and redirect
            session()->forget('selected_faculty_id');
            return redirect()->route('faculty.selection')->withErrors([
                'faculty_id' => 'Anda tidak memiliki akses ke fakultas yang dipilih.'
            ]);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Helpers\FacultyHelper;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();
        $userWithRole = \App\Models\User::with('role')->find($user->id);

        // Hanya redirect faculty selection jika BUKAN Mahasiswa
        if (
            $userWithRole && $userWithRole->role &&
            $userWithRole->role->role_name !== 'Mahasiswa' &&
            !\App\Helpers\FacultyHelper::getSelectedFaculty()
        ) {
            return redirect()->route('faculty.selection');
        }

        // Redirect berdasarkan role user
        if ($userWithRole && $userWithRole->role) {
            switch ($userWithRole->role->role_name) {
                case 'Super Admin':
                case 'Admin':
                    return redirect()->intended(route('admin.dashboard'));
                
                case 'Dekan':
                case 'Dosen':
                case 'Mahasiswa':
                    return redirect()->intended(route('dashboard'));
                
                default:
                    return redirect()->intended(route('dashboard'));
            }
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

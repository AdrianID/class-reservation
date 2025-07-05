<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                
                // Load relationship role dengan query fresh
                $userWithRole = \App\Models\User::with('role')->find($user->id);

                // Redirect berdasarkan role
                return $this->redirectBasedOnRole($userWithRole->role->role_name ?? 'guest');
            }
        }

        return $next($request);
    }

    /**
     * Redirect user berdasarkan role mereka
     */
    private function redirectBasedOnRole(string $roleName): Response
    {
        switch ($roleName) {
            case 'Super Admin':
            case 'Admin':
                return redirect()->route('admin.dashboard');
            
            case 'Dekan':
            case 'Dosen':
            case 'Mahasiswa':
                return redirect()->route('dashboard');
            
            default:
                return redirect('/dashboard');
        }
    }
} 
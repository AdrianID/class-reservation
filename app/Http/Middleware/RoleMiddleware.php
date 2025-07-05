<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // Load relationship role dengan query fresh
        $userWithRole = \App\Models\User::with('role')->find($user->id);

        // Cek apakah user memiliki role yang diizinkan
        if (!$userWithRole->role || !in_array($userWithRole->role->role_name, $roles)) {
            // Redirect berdasarkan role user
                         return $this->redirectBasedOnRole($userWithRole->role->role_name ?? 'guest');
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
                return redirect()->route('admin.dashboard')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            
            case 'Dekan':
            case 'Dosen':
            case 'Mahasiswa':
                return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            
            default:
                return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu.');
        }
    }
} 
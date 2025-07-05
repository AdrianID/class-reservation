<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Load user dengan role jika user sudah login
        if ($user) {
            $userWithRole = \App\Models\User::with('role')->find($user->id);
            $user = $userWithRole;
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
        ];
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function dashboard()
    {
        // You can pass any data needed for the dashboard here
        return Inertia::render('Admin/Dashboard', [
            'user' => Auth::user(),
            'flash' => session('flash', null),
        ]);
    }

    /**
     * Display room management page
     */
    public function roomIndex()
    {
        return Inertia::render('Admin/Room/Index', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display room creation page
     */
    public function roomCreate()
    {
        return Inertia::render('Admin/Room/Create', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display schedule management page
     */
    public function scheduleIndex()
    {
        return Inertia::render('Admin/Schedule/Index', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display schedule management page
     */
    public function scheduleManage()
    {
        return Inertia::render('Admin/Schedule/Manage', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display user management page
     */
    public function userIndex()
    {
        return Inertia::render('Admin/User/Index', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display settings page
     */
    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'user' => Auth::user(),
        ]);
    }
}

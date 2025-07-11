<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Helpers\FacultyHelper;

class AdminController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // You can pass any data needed for the dashboard here
        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
            'flash' => session('flash', null),
        ]);
    }

    /**
     * Display room management page
     */
    public function roomIndex()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/Room/Index', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }

    /**
     * Display room creation page
     */
    public function roomCreate()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/Room/Create', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }

    /**
     * Display schedule management page
     */
    public function scheduleIndex()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/Schedule/Index', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }

    /**
     * Display schedule management page
     */
    public function scheduleManage()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/Schedule/Manage', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }

    /**
     * Display user management page
     */
    public function userIndex()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/User/Index', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }

    /**
     * Display settings page
     */
    public function settings()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        return Inertia::render('Admin/Settings', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
        ]);
    }
}

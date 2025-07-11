<?php

namespace App\Helpers;

use App\Models\Faculty;
use Illuminate\Support\Facades\Auth;

class FacultyHelper
{
    /**
     * Get the currently selected faculty for the authenticated user
     */
    public static function getSelectedFaculty()
    {
        if (session('selected_faculty_id')) {
            return Faculty::find(session('selected_faculty_id'));
        }
        
        return null;
    }

    /**
     * Get the selected faculty ID
     */
    public static function getSelectedFacultyId()
    {
        return session('selected_faculty_id');
    }

    /**
     * Check if user has selected a faculty
     */
    public static function hasSelectedFaculty()
    {
        return session()->has('selected_faculty_id');
    }

    /**
     * Get accessible faculties for current user
     */
    public static function getAccessibleFaculties()
    {
        $user = Auth::user();
        
        if (!$user) {
            return collect();
        }

        return $user->getAccessibleFaculties();
    }

    /**
     * Check if current user is super admin
     */
    public static function isSuperAdmin()
    {
        $user = Auth::user();
        
        if (!$user) {
            return false;
        }

        return $user->isSuperAdmin();
    }
} 
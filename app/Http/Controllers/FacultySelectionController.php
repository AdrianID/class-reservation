<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Faculty;
use App\Models\User;

class FacultySelectionController extends Controller
{
    /**
     * Show faculty selection page
     */
    public function index()
    {
        $user = Auth::user();
        $faculties = $user->getAccessibleFaculties();

        return Inertia::render('FacultySelection', [
            'faculties' => $faculties,
            'user' => $user,
        ]);
    }

    /**
     * Store selected faculty in session
     */
    public function store(Request $request)
    {
        $request->validate([
            'faculty_id' => 'required|exists:faculties,id',
        ]);

        $user = Auth::user();
        $facultyId = $request->faculty_id;

        // Check if user has access to this faculty
        if (!$user->hasFacultyAccess($facultyId)) {
            return back()->withErrors(['faculty_id' => 'Anda tidak memiliki akses ke fakultas ini.']);
        }

        // Store faculty selection in session
        session(['selected_faculty_id' => $facultyId]);

        return redirect()->route('admin.dashboard')->with('flash', [
            'message' => 'Fakultas berhasil dipilih.',
            'type' => 'success'
        ]);
    }

    /**
     * Clear faculty selection
     */
    public function clear()
    {
        session()->forget('selected_faculty_id');
        
        return redirect()->route('faculty.selection')->with('flash', [
            'message' => 'Pilihan fakultas telah dihapus.',
            'type' => 'info'
        ]);
    }
}

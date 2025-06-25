<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Building;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $faculties = Faculty::select('id', 'faculty_name as label', 'id as value')
            ->get()
            ->map(function ($faculty) {
                return [
                    'value' => $faculty->id,
                    'label' => $faculty->label,
                ];
            });

        $buildings = Building::with('faculty')
            ->select('id', 'faculty_id', 'building_name as label', 'id as value')
            ->get()
            ->groupBy('faculty_id')
            ->map(function ($buildings) {
                return $buildings->map(function ($building) {
                    return [
                        'value' => $building->id,
                        'label' => $building->label,
                    ];
                })->toArray();
            });

        return Inertia::render('Dashboard', [
            'user' => Auth::user(),
            'faculties' => $faculties,
            'buildings' => $buildings,
        ]);
    }

    // Method untuk menangani navigasi ke fitur classroom
    public function classroomFeature($feature)
    {
        $user = Auth::user();

        switch ($feature) {
            case 'reservasi':
                return redirect()->route('peminjaman.index');

            case 'jadwal':
                return redirect()->route('jadwal.index');

            case 'ruangan':
                return redirect()->route('ruangan.index');

            default:
                return redirect()->route('dashboard')->with('message', 'Fitur belum tersedia');
        }
    }
}

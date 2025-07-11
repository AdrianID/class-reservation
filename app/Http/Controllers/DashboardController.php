<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Building;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get booking statistics
        $stats = [
            'total' => Booking::where('user_id', $user->id)->count(),
            'pending' => Booking::where('user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'approved' => Booking::where('user_id', $user->id)
                ->where('status', 'approved')
                ->count(),
            'rejected' => Booking::where('user_id', $user->id)
                ->where('status', 'rejected')
                ->count(),
        ];

        // Get upcoming bookings
        $upcomingBookings = Booking::with(['room.building'])
            ->where('user_id', $user->id)
            ->where('booking_date', '>=', now())
            ->where('status', '!=', 'rejected')
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->limit(5)
            ->get();

        // Get faculties and buildings for booking modal
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

        return Inertia::render('Mahasiswa/Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'stats' => $stats,
            'upcomingBookings' => $upcomingBookings,
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
                return redirect()->route('dashboard')->with('message', 'Feature not available');
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Building;
use Inertia\Inertia;

class RuanganController extends Controller
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

        return Inertia::render('Mahasiswa/Ruangan/Index', [
            'faculties' => $faculties,
            'buildings' => $buildings,
        ]);
    }
    public function list()
    {
        return Inertia::render('Mahasiswa/Ruangan/RoomList');
    }
    public function detail()
    {
        return Inertia::render('Mahasiswa/Ruangan/RoomDetail');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\Request;
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

        return Inertia::render('Mahasiswa/Ruangan/RoomList', [
            'faculties' => $faculties,
            'buildings' => $buildings,
        ]);
    }

    public function getRooms(Request $request)
    {
        $query = Room::with(['building.faculty', 'category', 'facilities'])
            ->when($request->faculty_id, function ($q) use ($request) {
                $q->whereHas('building', function ($q) use ($request) {
                    $q->where('faculty_id', $request->faculty_id);
                });
            })
            ->when($request->building_id, function ($q) use ($request) {
                $q->where('building_id', $request->building_id);
            })
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('room_name', 'like', '%' . $request->search . '%')
                        ->orWhere('room_code', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->when($request->facility_id, function ($q) use ($request) {
                $q->whereHas('facilities', function ($q) use ($request) {
                    $q->where('facilities.id', $request->facility_id);
                });
            });

        $rooms = $query->get()->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->room_name,
                'code' => $room->room_code,
                'status' => $room->status,
                'image' => $room->image_path ? asset('storage/' . $room->image_path) : null,
                'location' => $room->building->building_name,
                'capacity' => $room->capacity,
                'facilities' => $room->facilities->map(function ($facility) {
                    return $facility->facility_name;
                })->toArray(),
                'description' => $room->description,
                'category' => $room->category ? $room->category->category_name : null,
            ];
        });

        return response()->json($rooms);
    }

    public function detail()
    {
        return Inertia::render('Mahasiswa/Ruangan/RoomDetail');
    }
}

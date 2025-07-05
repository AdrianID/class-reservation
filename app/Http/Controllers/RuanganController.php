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

    public function list(Request $request)
    {
        $query = Room::query()
            ->with(['building.faculty', 'category', 'facilities'])
            ->where('status', '!=', 'maintenance') // Hide maintenance rooms for students
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('room_name', 'like', "%{$search}%")
                      ->orWhere('room_code', 'like', "%{$search}%")
                      ->orWhereHas('building', function ($buildingQuery) use ($search) {
                          $buildingQuery->where('building_name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('building.faculty', function ($facultyQuery) use ($search) {
                          $facultyQuery->where('faculty_name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->building_id, function ($query, $buildingId) {
                $query->where('building_id', $buildingId);
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->faculty_id, function ($query, $facultyId) {
                $query->whereHas('building', function ($buildingQuery) use ($facultyId) {
                    $buildingQuery->where('faculty_id', $facultyId);
                });
            })
            ->when($request->facility_id, function ($query, $facilityId) {
                $query->withFacility($facilityId);
            });

        $rooms = $query->latest()->get();

        // Transform data untuk frontend
        $transformedRooms = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->room_name,
                'room_code' => $room->room_code,
                'status' => $this->mapStatus($room->status),
                'image' => $room->image_path ? asset('storage/' . $room->image_path) : null,
                'location' => $room->building->building_name . ', ' . $room->building->faculty->faculty_name,
                'building_name' => $room->building->building_name,
                'faculty_name' => $room->building->faculty->faculty_name,
                'capacity' => $room->capacity . ' orang',
                'facilities' => $room->facilities->map(function ($facility) {
                    return $facility->facility_name;
                })->toArray(),
                'category' => $room->category->category_name,
                'description' => $room->description,
                'badgeColor' => $this->getStatusBadgeColor($room->status),
            ];
        });

        return Inertia::render('Mahasiswa/Ruangan/RoomList', [
            'classRooms' => $transformedRooms,
            'filters' => $request->only(['search', 'building_id', 'category_id', 'faculty_id', 'facility_id']),
        ]);
    }

    public function detail($id)
    {
        $room = Room::with(['building.faculty', 'category', 'facilities'])
            ->findOrFail($id);

        // Transform data untuk detail view
        $roomDetail = [
            'id' => $room->id,
            'name' => $room->room_name,
            'room_code' => $room->room_code,
            'status' => $this->mapStatus($room->status),
            'image' => $room->image_path ? asset('storage/' . $room->image_path) : null,
            'location' => $room->building->building_name . ', ' . $room->building->faculty->faculty_name,
            'building_name' => $room->building->building_name,
            'faculty_name' => $room->building->faculty->faculty_name,
            'capacity' => $room->capacity . ' orang',
            'facilities' => $room->facilities->map(function ($facility) {
                return [
                    'name' => $facility->facility_name,
                    'quantity' => $facility->pivot->quantity,
                    'notes' => $facility->pivot->notes,
                ];
            })->toArray(),
            'category' => $room->category->category_name,
            'description' => $room->description,
        ];

        return Inertia::render('Mahasiswa/Ruangan/RoomDetail', [
            'roomDetail' => $roomDetail,
        ]);
    }

    /**
     * Map database status to frontend status
     */
    private function mapStatus($status)
    {
        switch ($status) {
            case 'available':
                return 'tersedia';
            case 'booked':
                return 'digunakan';
            case 'maintenance':
                return 'maintenance';
            default:
                return 'tersedia';
        }
    }

    /**
     * Get status badge color
     */
    private function getStatusBadgeColor($status)
    {
        switch ($status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'booked':
                return 'bg-yellow-100 text-yellow-800';
            case 'maintenance':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }


}

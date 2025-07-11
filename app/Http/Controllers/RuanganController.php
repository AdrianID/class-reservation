<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class RuanganController extends Controller
{
    public function index(Request $request)
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

        // Get user's bookings
        $bookings = Booking::with(['room.building', 'documents'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        // Get faculties for dropdown
        $faculties = Faculty::select('id', 'faculty_name as label', 'id as value')
            ->get()
            ->map(function ($faculty) {
                return [
                    'value' => $faculty->id,
                    'label' => $faculty->label,
                ];
            });

        // Get buildings grouped by faculty
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
            'rooms' => $rooms,
            'bookings' => $bookings,
            'faculties' => $faculties,
            'buildings' => $buildings,
            'filters' => $request->only(['faculty_id', 'building_id', 'search', 'status', 'facility_id']),
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

    public function showBooking(Booking $booking)
    {
        // Authorize that the user can view this booking
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat peminjaman ini.');
        }

        $booking->load(['room.building', 'documents.type']);

        return Inertia::render('Mahasiswa/Peminjaman/Show', [
            'booking' => $booking
        ]);
    }
}

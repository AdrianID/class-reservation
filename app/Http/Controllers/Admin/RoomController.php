<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Building;
use App\Models\RoomCategory;
use App\Models\Facility;
use App\Models\Room;
use App\Helpers\FacultyHelper;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Get filters from request
        $filters = $request->only(['search', 'building_id', 'category_id', 'status', 'facility_id']);

        // Get data for filters based on selected faculty
        $buildingsQuery = Building::with('faculty');
        $categories = RoomCategory::all();
        $facilities = Facility::all();
        $statuses = ['available', 'maintenance', 'booked'];

        // Filter buildings by selected faculty
        if ($selectedFaculty) {
            $buildingsQuery->where('faculty_id', $selectedFaculty->id);
        }
        $buildings = $buildingsQuery->get();

        // Get rooms with relationships
        $query = Room::with(['building.faculty', 'category', 'facilities']);

        // Apply faculty filter if selected
        if ($selectedFaculty) {
            $query->whereHas('building', function ($q) use ($selectedFaculty) {
                $q->where('faculty_id', $selectedFaculty->id);
            });
        }

        // Apply building filter
        if (!empty($filters['building_id'])) {
            $query->where('building_id', $filters['building_id']);
        }

        // Apply category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply facility filter
        if (!empty($filters['facility_id'])) {
            $query->whereHas('facilities', function ($q) use ($filters) {
                $q->where('facilities.id', $filters['facility_id']);
            });
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('room_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('room_code', 'like', '%' . $filters['search'] . '%');
            });
        }

        $rooms = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Room/Index', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
            'rooms' => $rooms,
            'filters' => $filters,
            'buildings' => $buildings,
            'categories' => $categories,
            'facilities' => $facilities,
            'statuses' => $statuses,
            'flash' => session('flash'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Get data for form
        $buildingsQuery = Building::with('faculty');
        $categories = RoomCategory::all();
        $facilities = Facility::all();

        // Filter buildings by selected faculty
        if ($selectedFaculty) {
            $buildingsQuery->where('faculty_id', $selectedFaculty->id);
        }
        $buildings = $buildingsQuery->get();

        return Inertia::render('Admin/Room/Create', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
            'buildings' => $buildings,
            'categories' => $categories,
            'facilities' => $facilities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Validate request
        $validatedData = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'category_id' => 'required|exists:room_categories,id',
            'room_code' => 'required|string|max:20|unique:rooms',
            'room_name' => 'required|string|max:255',
            'location_detail' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:available,maintenance,booked',
            'image' => 'nullable|image|max:2048',
            'facilities' => 'nullable|array',
            'facilities.*.facility_id' => 'required|exists:facilities,id',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.notes' => 'nullable|string',
        ]);

        // Check if building belongs to selected faculty
        if ($selectedFaculty) {
            $building = Building::find($validatedData['building_id']);
            if (!$building || $building->faculty_id !== $selectedFaculty->id) {
                abort(403, 'Anda tidak memiliki akses ke gedung ini.');
            }
            $validatedData['faculty_id'] = $selectedFaculty->id;
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('rooms', 'public');
            $validatedData['image_path'] = $imagePath;
        }

        // Create room
        $room = Room::create($validatedData);

        // Save facilities if provided
        if ($request->has('facilities')) {
            $facilitiesData = collect($request->facilities)->mapWithKeys(function ($facility) {
                return [$facility['facility_id'] => [
                    'quantity' => $facility['quantity'],
                    'notes' => $facility['notes'] ?? null,
                ]];
            })->toArray();

            $room->facilities()->attach($facilitiesData);
        }

        return redirect()->route('admin.ruangan.index')->with('flash', [
            'type' => 'success',
            'message' => 'Ruangan berhasil ditambahkan.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Get room with relationships
        $room = Room::with(['building.faculty', 'category', 'facilities'])->findOrFail($id);

        // Check if user has access to this room's faculty
        if ($selectedFaculty && $room->building->faculty_id !== $selectedFaculty->id) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }

        return Inertia::render('Admin/Room/Show', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
            'room' => $room,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Ambil data ruangan beserta relasi yang dibutuhkan
        $room = Room::with(['building.faculty', 'category', 'facilities'])->findOrFail($id);

        // Check if user has access to this room's faculty
        if ($selectedFaculty && $room->building->faculty_id !== $selectedFaculty->id) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }

        // Ambil data lain untuk form
        $buildingsQuery = Building::with('faculty');
        $categories = RoomCategory::all();
        $facilities = Facility::all();

        // Filter buildings by selected faculty
        if ($selectedFaculty) {
            $buildingsQuery->where('faculty_id', $selectedFaculty->id);
        }
        $buildings = $buildingsQuery->get();

        // Format fasilitas ruangan (jika perlu)
        $roomFacilities = $room->facilities->map(function($facility) {
            return [
                'facility_id' => $facility->id,
                'quantity' => $facility->pivot->quantity ?? 1,
                'notes' => $facility->pivot->notes ?? '',
            ];
        });

        // Siapkan data room untuk frontend
        $roomData = $room->toArray();
        $roomData['facilities_list'] = $roomFacilities;

        return Inertia::render('Admin/Room/Edit', [
            'user' => $user,
            'selectedFaculty' => $selectedFaculty,
            'room' => $roomData,
            'buildings' => $buildings,
            'categories' => $categories,
            'facilities' => $facilities,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Find the room
        $room = Room::with('building')->findOrFail($id);

        // Check if user has access to this room's faculty
        if ($selectedFaculty && $room->building->faculty_id !== $selectedFaculty->id) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }

        // Validate request
        $validatedData = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'category_id' => 'required|exists:room_categories,id',
            'room_code' => 'required|string|max:20|unique:rooms,room_code,' . $id,
            'room_name' => 'required|string|max:255',
            'location_detail' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:available,maintenance,booked',
            'image' => 'nullable|image|max:2048',
            'facilities' => 'nullable|array',
            'facilities.*.facility_id' => 'required|exists:facilities,id',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.notes' => 'nullable|string',
        ]);

        // Check if building belongs to selected faculty
        if ($selectedFaculty) {
            $building = Building::find($validatedData['building_id']);
            if (!$building || $building->faculty_id !== $selectedFaculty->id) {
                abort(403, 'Anda tidak memiliki akses ke gedung ini.');
            }
            $validatedData['faculty_id'] = $selectedFaculty->id;
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($room->image_path && file_exists(storage_path('app/public/' . $room->image_path))) {
                unlink(storage_path('app/public/' . $room->image_path));
            }

            // Store new image
            $imagePath = $request->file('image')->store('rooms', 'public');
            $validatedData['image_path'] = $imagePath;
        }

        // Update room data
        $room->update($validatedData);

        // Update facilities if provided
        if ($request->has('facilities')) {
            $facilitiesData = collect($request->facilities)->mapWithKeys(function ($facility) {
                return [$facility['facility_id'] => [
                    'quantity' => $facility['quantity'],
                    'notes' => $facility['notes'] ?? null,
                ]];
            })->toArray();

            $room->facilities()->sync($facilitiesData);
        }

        return redirect()->route('admin.ruangan.index')->with('flash', [
            'type' => 'success',
            'message' => 'Ruangan berhasil diperbarui.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        // Find the room
        $room = Room::with('building')->findOrFail($id);

        // Check if user has access to this room's faculty
        if ($selectedFaculty && $room->building->faculty_id !== $selectedFaculty->id) {
            abort(403, 'Anda tidak memiliki akses ke ruangan ini.');
        }

        // Delete image if exists
        if ($room->image_path && file_exists(storage_path('app/public/' . $room->image_path))) {
            unlink(storage_path('app/public/' . $room->image_path));
        }

        // Delete room facilities
        $room->facilities()->detach();

        // Delete the room
        $room->delete();

        return redirect()->route('admin.ruangan.index')->with('flash', [
            'type' => 'success',
            'message' => 'Ruangan berhasil dihapus.'
        ]);
    }

    /**
     * Get rooms by facility
     */
    public function getRoomsByFacility(Request $request)
    {
        $user = Auth::user();
        $selectedFaculty = FacultyHelper::getSelectedFaculty();

        $facilityId = $request->get('facility_id');
        
        if (!$facilityId) {
            return response()->json(['error' => 'Facility ID is required'], 400);
        }

        $query = Room::with(['building.faculty', 'category'])
            ->whereHas('facilities', function ($q) use ($facilityId) {
                $q->where('facilities.id', $facilityId);
            });

        // Apply faculty filter if selected
        if ($selectedFaculty) {
            $query->whereHas('building', function ($q) use ($selectedFaculty) {
                $q->where('faculty_id', $selectedFaculty->id);
            });
        }

        $rooms = $query->get();

        return response()->json([
            'rooms' => $rooms,
            'facility_id' => $facilityId,
        ]);
    }
}

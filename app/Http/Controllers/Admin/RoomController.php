<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Faculty;
use App\Models\Facility;
use App\Models\Room;
use App\Models\RoomCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query()
            ->with(['building.faculty', 'category', 'facilities'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('room_name', 'like', "%{$search}%")
                      ->orWhere('room_code', 'like', "%{$search}%");
                });
            })
            ->when($request->building_id, function ($query, $buildingId) {
                $query->where('building_id', $buildingId);
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->facility_id, function ($query, $facilityId) {
                $query->withFacility($facilityId);
            })
            ->when($request->facilities, function ($query, $facilities) {
                if (is_array($facilities) && !empty($facilities)) {
                    $query->withFacilities($facilities);
                }
            });

        $rooms = $query->latest()->paginate(10)->withQueryString();

        // Transform facilities data untuk frontend
        $rooms->getCollection()->transform(function ($room) {
            $room->facilities_list = $room->facilities->map(function ($facility) {
                return [
                    'id' => $facility->id,
                    'facility_name' => $facility->facility_name,
                    'quantity' => $facility->pivot->quantity,
                    'notes' => $facility->pivot->notes,
                ];
            });
            return $room;
        });

        return Inertia::render('Admin/Room/Index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search', 'building_id', 'category_id', 'status', 'facility_id', 'facilities']),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
            'facilities' => Facility::active()->get(),
            'statuses' => ['available', 'maintenance', 'booked'],
        ]);
    }

    public function show($id)
    {
        $room = Room::with(['building.faculty', 'category', 'facilities'])->findOrFail($id);

        // Transform facilities data untuk detail view
        $room->facilities_list = $room->facilities->map(function ($facility) {
            return [
                'id' => $facility->id,
                'facility_name' => $facility->facility_name,
                'facility_code' => $facility->facility_code,
                'quantity' => $facility->pivot->quantity,
                'notes' => $facility->pivot->notes,
                'unit' => $facility->unit,
            ];
        });

        return Inertia::render('Admin/Room/Show', [
            'room' => $room,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Room/Create', [
            'faculties' => Faculty::all(),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
            'facilities' => Facility::active()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'category_id' => 'required|exists:room_categories,id',
            'room_code' => 'required|string|max:20|unique:rooms',
            'room_name' => 'required|string|max:255',
            'location_detail' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:available,maintenance,booked',
            'image' => 'nullable|image|max:2048', // max 2MB
            'facilities' => 'nullable|array',
            'facilities.*.facility_id' => 'required|exists:facilities,id',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('rooms', 'public');
                $validatedData['image_path'] = $imagePath;
            }

            $room = Room::create($validatedData);

            // Save facilities using many-to-many relationship
            if (!empty($validatedData['facilities'])) {
                foreach ($validatedData['facilities'] as $facility) {
                    $room->facilities()->attach($facility['facility_id'], [
                        'quantity' => $facility['quantity'],
                        'notes' => $facility['notes'] ?? null,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.ruangan.index')
                ->with('flash', ['type' => 'success', 'message' => 'Ruangan berhasil ditambahkan.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()
                ->with('flash', ['type' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $room = Room::with(['building.faculty', 'facilities', 'category'])->findOrFail($id);

        // Transform facilities data untuk form edit
        $room->facilities_list = $room->facilities->map(function ($facility) {
            return [
                'facility_id' => $facility->id,
                'facility_name' => $facility->facility_name,
                'quantity' => $facility->pivot->quantity,
                'notes' => $facility->pivot->notes,
            ];
        });

        return Inertia::render('Admin/Room/Edit', [
            'room' => $room,
            'faculties' => Faculty::all(),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
            'facilities' => Facility::active()->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validatedData = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'category_id' => 'required|exists:room_categories,id',
            'room_code' => ['required', 'string', 'max:20', Rule::unique('rooms')->ignore($id)],
            'room_name' => 'required|string|max:255',
            'location_detail' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:available,maintenance,booked',
            'image' => 'nullable|image|max:2048', // max 2MB
            'facilities' => 'nullable|array',
            'facilities.*.facility_id' => 'required|exists:facilities,id',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($room->image_path) {
                    Storage::disk('public')->delete($room->image_path);
                }
                
                $imagePath = $request->file('image')->store('rooms', 'public');
                $validatedData['image_path'] = $imagePath;
            }

            $room->update($validatedData);

            // Update facilities using many-to-many relationship
            if (!empty($validatedData['facilities'])) {
                // Prepare sync data
                $syncData = [];
                foreach ($validatedData['facilities'] as $facility) {
                    $syncData[$facility['facility_id']] = [
                        'quantity' => $facility['quantity'],
                        'notes' => $facility['notes'] ?? null,
                    ];
                }
                
                // Sync facilities (this will add new ones and remove ones not in the list)
                $room->facilities()->sync($syncData);
            } else {
                // Detach all facilities if none provided
                $room->facilities()->detach();
            }

            DB::commit();
            return redirect()->route('admin.ruangan.index')
                ->with('flash', ['type' => 'success', 'message' => 'Ruangan berhasil diperbarui.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()
                ->with('flash', ['type' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $room = Room::findOrFail($id);
            
            // Check if the room has any bookings
            if ($room->bookings()->exists()) {
                return redirect()->back()
                    ->with('flash', ['type' => 'error', 'message' => 'Ruangan tidak dapat dihapus karena memiliki peminjaman.']);
            }
            
            // Delete image if exists
            if ($room->image_path) {
                Storage::disk('public')->delete($room->image_path);
            }
            
            // Detach facilities (many-to-many relationship)
            $room->facilities()->detach();
            
            // Delete the room
            $room->delete();
            
            return redirect()->route('admin.ruangan.index')
                ->with('flash', ['type' => 'success', 'message' => 'Ruangan berhasil dihapus.']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('flash', ['type' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Get rooms by facility (API endpoint)
     */
    public function getRoomsByFacility(Request $request)
    {
        $facilityId = $request->get('facility_id');
        $facilityIds = $request->get('facility_ids', []);

        $query = Room::with(['building.faculty', 'category', 'facilities'])
            ->where('status', 'available');

        if ($facilityId) {
            $query->withFacility($facilityId);
        }

        if (!empty($facilityIds) && is_array($facilityIds)) {
            $query->withFacilities($facilityIds);
        }

        $rooms = $query->get();

        // Transform facilities data
        $rooms->transform(function ($room) {
            $room->facilities_list = $room->facilities->map(function ($facility) {
                return [
                    'id' => $facility->id,
                    'facility_name' => $facility->facility_name,
                    'facility_code' => $facility->facility_code,
                    'quantity' => $facility->pivot->quantity,
                    'notes' => $facility->pivot->notes,
                    'unit' => $facility->unit,
                ];
            });
            return $room;
        });

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Faculty;
use App\Models\Room;
use App\Models\RoomCategory;
use App\Models\RoomFacility;
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
            });

        $rooms = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Room/Index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search', 'building_id', 'category_id', 'status']),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
            'statuses' => ['available', 'maintenance', 'booked'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Room/Create', [
            'faculties' => Faculty::all(),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
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
            'facilities.*.facility_name' => 'required|string|max:255',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('rooms', 'public');
                $validatedData['image_path'] = $imagePath;
            }

            $room = Room::create($validatedData);

            // Save facilities
            if (!empty($validatedData['facilities'])) {
                foreach ($validatedData['facilities'] as $facility) {
                    $room->facilities()->create([
                        'facility_name' => $facility['facility_name'],
                        'quantity' => $facility['quantity'],
                        'description' => $facility['description'] ?? null,
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

        return Inertia::render('Admin/Room/Edit', [
            'room' => $room,
            'faculties' => Faculty::all(),
            'buildings' => Building::with('faculty')->get(),
            'categories' => RoomCategory::all(),
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
            'facilities.*.id' => 'nullable|exists:room_facilities,id',
            'facilities.*.facility_name' => 'required|string|max:255',
            'facilities.*.quantity' => 'required|integer|min:1',
            'facilities.*.description' => 'nullable|string',
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

            // Update facilities
            if (!empty($validatedData['facilities'])) {
                // Get IDs of existing facilities that are being kept
                $keepFacilityIds = collect($validatedData['facilities'])
                    ->pluck('id')
                    ->filter()
                    ->toArray();
                
                // Delete facilities not in the list
                $room->facilities()->whereNotIn('id', $keepFacilityIds)->delete();
                
                // Update or create facilities
                foreach ($validatedData['facilities'] as $facility) {
                    if (!empty($facility['id'])) {
                        $room->facilities()->where('id', $facility['id'])->update([
                            'facility_name' => $facility['facility_name'],
                            'quantity' => $facility['quantity'],
                            'description' => $facility['description'] ?? null,
                        ]);
                    } else {
                        $room->facilities()->create([
                            'facility_name' => $facility['facility_name'],
                            'quantity' => $facility['quantity'],
                            'description' => $facility['description'] ?? null,
                        ]);
                    }
                }
            } else {
                // Delete all facilities if none provided
                $room->facilities()->delete();
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
            
            // Delete related facilities
            $room->facilities()->delete();
            
            // Delete the room
            $room->delete();
            
            return redirect()->route('admin.ruangan.index')
                ->with('flash', ['type' => 'success', 'message' => 'Ruangan berhasil dihapus.']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('flash', ['type' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use App\Helpers\FacultyHelper;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $selectedFaculty = FacultyHelper::getSelectedFaculty();
        $query = Booking::with(['user', 'room.building.faculty'])
            ->when($selectedFaculty, function ($query, $faculty) {
                $query->whereHas('room.building', function ($q) use ($faculty) {
                    $q->where('faculty_id', $faculty->id);
                });
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('room', function ($roomQuery) use ($search) {
                        $roomQuery->where('room_name', 'like', "%{$search}%")
                            ->orWhere('room_code', 'like', "%{$search}%");
                    })
                    ->orWhere('purpose', 'like', "%{$search}%");
                });
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('booking_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('booking_date', '<=', $dateTo);
            });

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $bookings = $query->paginate(15)->withQueryString();

        // Get statistics
        $statistics = [
            'total' => Booking::count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'approved' => Booking::where('status', 'approved')->count(),
            'rejected' => Booking::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Booking/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to', 'sort_field', 'sort_direction']),
            'statistics' => $statistics,
        ]);
    }

    public function show($id)
    {
        $booking = Booking::with([
            'user',
            'room.building.faculty',
            'room.category',
            'documents.type'
        ])->findOrFail($id);

        return Inertia::render('Admin/Booking/Show', [
            'booking' => $booking
        ]);
    }

    public function approve(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        // Check if this room is available for this time slot
        $conflictingBooking = Booking::where('id', '!=', $id)
            ->where('room_id', $booking->room_id)
            ->where('booking_date', $booking->booking_date)
            ->where('status', 'approved')
            ->where(function ($query) use ($booking) {
                $query->whereBetween('start_time', [$booking->start_time, $booking->end_time])
                    ->orWhereBetween('end_time', [$booking->start_time, $booking->end_time])
                    ->orWhere(function ($q) use ($booking) {
                        $q->where('start_time', '<=', $booking->start_time)
                            ->where('end_time', '>=', $booking->end_time);
                    });
            })
            ->first();

        if ($conflictingBooking) {
            return redirect()->back()->with('error', 'Tidak dapat menyetujui booking karena terdapat jadwal yang bertabrakan.');
        }

        $booking->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $request->admin_notes
        ]);

        // Tambahkan log atau notifikasi jika diperlukan
        
        return redirect()->back()->with('success', 'Booking berhasil disetujui.');
    }

    public function reject(Request $request, $id)
    {
        $validatedData = $request->validate([
            'admin_notes' => 'required|string|max:255',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $validatedData['admin_notes']
        ]);

        // Tambahkan log atau notifikasi jika diperlukan
        
        return redirect()->back()->with('success', 'Booking berhasil ditolak.');
    }

    public function export(Request $request)
    {
        // Logic untuk mengekspor data booking ke format Excel/PDF
        // Ini hanya skeleton, implementasi sebenarnya memerlukan package tambahan

        return response()->download('path/to/exported/file');
    }
} 
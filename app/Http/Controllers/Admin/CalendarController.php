<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MaintenanceLog;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        // Default tanggal ke bulan sekarang jika tidak ada parameter
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);
        
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();
        
        // Ambil data ruangan
        $rooms = Room::select('id', 'room_name', 'room_code', 'status')
            ->orderBy('room_name')
            ->get();
            
        // Filter berdasarkan ruangan jika ada
        $roomFilter = $request->input('room_id');
        $categoryFilter = $request->input('category');
        
        // Ambil booking dalam rentang bulan
        $bookings = Booking::with(['room'])
            ->whereBetween('booking_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->when($roomFilter, function ($query) use ($roomFilter) {
                return $query->where('room_id', $roomFilter);
            })
            ->when($categoryFilter === 'booking', function ($query) {
                return $query->whereNotNull('id');
            })
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => $booking->purpose ?? 'Peminjaman',
                    'date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'room_id' => $booking->room_id,
                    'room_name' => $booking->room->room_name,
                    'user_name' => $booking->user->name ?? 'User',
                    'status' => $booking->status,
                    'type' => 'booking',
                    'color' => '#3B82F6', // Blue
                ];
            });
            
        // Ambil maintenance dalam rentang bulan
        $maintenances = MaintenanceLog::with(['room'])
            ->whereBetween('maintenance_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->when($roomFilter, function ($query) use ($roomFilter) {
                return $query->where('room_id', $roomFilter);
            })
            ->when($categoryFilter === 'maintenance', function ($query) {
                return $query->whereNotNull('id');
            })
            ->get()
            ->map(function ($maintenance) {
                return [
                    'id' => $maintenance->id,
                    'title' => $maintenance->maintenance_type ?? 'Maintenance',
                    'date' => $maintenance->maintenance_date,
                    'start_time' => $maintenance->start_time,
                    'end_time' => $maintenance->end_time,
                    'room_id' => $maintenance->room_id,
                    'room_name' => $maintenance->room->room_name,
                    'notes' => $maintenance->notes,
                    'status' => $maintenance->status,
                    'type' => 'maintenance',
                    'color' => '#EF4444', // Red
                ];
            });
            
        // Gabungkan semua events
        $events = collect();
        
        if ($categoryFilter !== 'maintenance') {
            $events = $events->concat($bookings);
        }
        
        if ($categoryFilter !== 'booking') {
            $events = $events->concat($maintenances);
        }
        
        // Kelompokkan events berdasarkan tanggal
        $calendarEvents = $events->groupBy('date')->toArray();
        
        return Inertia::render('Admin/Calendar/Index', [
            'rooms' => $rooms,
            'events' => $calendarEvents,
            'filters' => [
                'month' => $month,
                'year' => $year,
                'room_id' => $roomFilter,
                'category' => $categoryFilter,
            ],
            'currentMonth' => $startDate->format('F Y'),
        ]);
    }
    
    public function getEvents(Request $request)
    {
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $roomId = $request->room_id;
        $category = $request->category;
        
        // Ambil booking
        $bookings = Booking::with(['room', 'user'])
            ->whereBetween('booking_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->when($roomId, function ($query) use ($roomId) {
                return $query->where('room_id', $roomId);
            })
            ->when($category === 'booking', function ($query) {
                return $query->whereNotNull('id');
            })
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => $booking->purpose ?? 'Peminjaman',
                    'date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'room_id' => $booking->room_id,
                    'room_name' => $booking->room->room_name,
                    'user_name' => $booking->user->name ?? 'User',
                    'status' => $booking->status,
                    'type' => 'booking',
                    'color' => '#3B82F6', // Blue
                ];
            });
            
        // Ambil maintenance
        $maintenances = MaintenanceLog::with(['room'])
            ->whereBetween('maintenance_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->when($roomId, function ($query) use ($roomId) {
                return $query->where('room_id', $roomId);
            })
            ->when($category === 'maintenance', function ($query) {
                return $query->whereNotNull('id');
            })
            ->get()
            ->map(function ($maintenance) {
                return [
                    'id' => $maintenance->id,
                    'title' => $maintenance->maintenance_type ?? 'Maintenance',
                    'date' => $maintenance->maintenance_date,
                    'start_time' => $maintenance->start_time,
                    'end_time' => $maintenance->end_time,
                    'room_id' => $maintenance->room_id,
                    'room_name' => $maintenance->room->room_name,
                    'notes' => $maintenance->notes,
                    'status' => $maintenance->status,
                    'type' => 'maintenance',
                    'color' => '#EF4444', // Red
                ];
            });
            
        // Gabungkan semua events
        $events = collect();
        
        if ($category !== 'maintenance') {
            $events = $events->concat($bookings);
        }
        
        if ($category !== 'booking') {
            $events = $events->concat($maintenances);
        }
        
        return response()->json([
            'events' => $events,
        ]);
    }
} 
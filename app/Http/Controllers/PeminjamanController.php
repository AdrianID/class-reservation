<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingDocument;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['room.building', 'documents'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Mahasiswa/Peminjaman/Index', [
            'bookings' => $bookings
        ]);
    }

    public function create()
    {
        return Inertia::render('Mahasiswa/Peminjaman/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'booking_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'purpose' => 'required|string|max:255',
            'number_of_participants' => 'required|integer|min:1',
            'responsible_person' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'permit_letter' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'proposal' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'attendance_list' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
            'additional_notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Cek ketersediaan ruangan
            $existingBooking = Booking::where('room_id', $request->room_id)
                ->where('booking_date', $request->booking_date)
                ->where(function($query) use ($request) {
                    $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                        ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
                })
                ->where('status', '!=', 'rejected')
                ->exists();

            if ($existingBooking) {
                return back()->withErrors([
                    'room_id' => 'Ruangan sudah dibooking untuk waktu yang dipilih.'
                ]);
            }

            // Simpan data booking
            $booking = Booking::create([
                'user_id' => auth()->id(),
                'room_id' => $validated['room_id'],
                'booking_date' => $validated['booking_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'purpose' => $validated['purpose'],
                'number_of_participants' => $validated['number_of_participants'],
                'status' => 'pending',
            ]);

            // Ambil tipe dokumen
            $documentTypes = DocumentType::all();

            // Permit Letter (Required)
            if ($request->hasFile('permit_letter')) {
                $file = $request->file('permit_letter');
                $permitLetterPath = $file->store('booking-documents/permit-letters', 'public');
                BookingDocument::create([
                    'booking_id' => $booking->id,
                    'document_type_id' => $documentTypes->where('type_name', 'Surat Permohonan')->first()->id,
                    'document_path' => $permitLetterPath,
                    'document_name' => $file->getClientOriginalName(),
                ]);
            }

            // Proposal (Optional)
            if ($request->hasFile('proposal')) {
                $file = $request->file('proposal');
                $proposalPath = $file->store('booking-documents/proposals', 'public');
                BookingDocument::create([
                    'booking_id' => $booking->id,
                    'document_type_id' => $documentTypes->where('type_name', 'Rencana Kegiatan')->first()->id,
                    'document_path' => $proposalPath,
                    'document_name' => $file->getClientOriginalName(),
                ]);
            }

            // Attendance List (Optional)
            if ($request->hasFile('attendance_list')) {
                $file = $request->file('attendance_list');
                $attendanceListPath = $file->store('booking-documents/attendance-lists', 'public');
                BookingDocument::create([
                    'booking_id' => $booking->id,
                    'document_type_id' => $documentTypes->where('type_name', 'Daftar Peserta')->first()->id,
                    'document_path' => $attendanceListPath,
                    'document_name' => $file->getClientOriginalName(),
                ]);
            }

            DB::commit();

            /* return redirect()->route('ruangan.index') */
            return redirect()->route('dashboard');
            /*     ->with('success', 'Permintaan peminjaman ruangan berhasil diajukan!'); */
            /* $successMessage = 'Permintaan peminjaman ruangan berhasil diajukan! Tim admin akan meninjau permintaan Anda dalam 2-3 hari kerja.';

            return redirect()->route('dashboard')
                ->with('success', $successMessage)
                ->with('booking_created', true); */

        } catch (\Exception $e) {
            DB::rollBack();

            // Hapus file yang sudah diupload jika ada error
            if (isset($permitLetterPath)) Storage::disk('public')->delete($permitLetterPath);
            if (isset($proposalPath)) Storage::disk('public')->delete($proposalPath);
            if (isset($attendanceListPath)) Storage::disk('public')->delete($attendanceListPath);

            // Log error untuk debugging
            Log::error('Booking Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat mengajukan peminjaman. Silakan coba lagi.'
            ]);
        }
    }

    public function show(Booking $booking)
    {
        // Authorize that the user can view this booking
        if ($booking->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat peminjaman ini.');
        }

        $booking->load(['room.building', 'documents.type']);

        return Inertia::render('Mahasiswa/Peminjaman/Show', [
            'booking' => $booking
        ]);
    }
}





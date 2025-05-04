<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Schedule/Index', [
            'user' => Auth::user(),
        ]);
    }

    public function manage()
    {
        return Inertia::render('Admin/Schedule/Manage', [
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        return redirect()->route('admin.jadwal.index')->with('flash', 'Jadwal berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        return redirect()->route('admin.jadwal.index')->with('flash', 'Jadwal berhasil dihapus.');
    }
}

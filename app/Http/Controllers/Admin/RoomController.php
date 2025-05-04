<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Room/Index', [
            'user' => Auth::user(),

        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Room/Create', [
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',

        ]);
        return redirect()->route('admin.ruangan.index')->with('flash', 'Ruangan berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/Room/Edit', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request, $id)
    {
        return redirect()->route('admin.ruangan.index')->with('flash', 'Ruangan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        return redirect()->route('admin.ruangan.index')->with('flash', 'Ruangan berhasil dihapus.');
    }
}

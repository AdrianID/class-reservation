<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('Jadwal/Index');
    }
    public function detail()
    {
        return Inertia::render('Jadwal/JadwalKelas');
    }
}


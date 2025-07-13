<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('Mahasiswa/Jadwal/Index');
    }
    public function detail()
    {
        return Inertia::render('Mahasiswa/Jadwal/ScheduleDetail');
    }
}


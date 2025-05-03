<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class RuanganController extends Controller
{
    public function index()
    {
        return Inertia::render('Ruangan/Index');
    }
    public function list()
    {
        return Inertia::render('Ruangan/RoomList');
    }
    public function detail()
    {
        return Inertia::render('Ruangan/RoomDetail');
    }
}

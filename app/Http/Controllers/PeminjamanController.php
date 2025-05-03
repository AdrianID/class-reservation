<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index()
    {
        return Inertia::render('Peminjaman/Index');
    }
}

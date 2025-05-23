<?php

// admin
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\ScheduleController;
// user
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\JadwalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Admin
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Room management
    Route::get('/ruangan', [RoomController::class, 'index'])->name('admin.ruangan.index');
    Route::get('/ruangan/create', [RoomController::class, 'create'])->name('admin.ruangan.create');
    Route::post('/ruangan', [RoomController::class, 'store'])->name('admin.ruangan.store');
    Route::get('/ruangan/{id}/edit', [RoomController::class, 'edit'])->name('admin.ruangan.edit');
    Route::put('/ruangan/{id}', [RoomController::class, 'update'])->name('admin.ruangan.update');
    Route::delete('/ruangan/{id}', [RoomController::class, 'destroy'])->name('admin.ruangan.destroy');

    // Schedule management
    Route::get('/jadwal', [ScheduleController::class, 'index'])->name('admin.jadwal.index');
    Route::get('/jadwal/manage', [ScheduleController::class, 'manage'])->name('admin.jadwal.manage');
    Route::post('/jadwal', [ScheduleController::class, 'store'])->name('admin.jadwal.store');
    Route::delete('/jadwal/{id}', [ScheduleController::class, 'destroy'])->name('admin.jadwal.destroy');

    // User management dan settings tetap di AdminController
    Route::prefix('users')->group(function () {
        Route::get('/mahasiswa', [AdminController::class, 'userIndex'])->name('admin.users.mahasiswa');
        Route::get('/dosen', [AdminController::class, 'userIndex'])->name('admin.users.dosen');
        Route::get('/staff', [AdminController::class, 'userIndex'])->name('admin.users.staff');
    });

    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
});

// User
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::get('/ruangan', [RuanganController::class, 'index'])->name('ruangan.index');
    Route::get('/ruangan/list', [RuanganController::class, 'list'])->name('ruangan.list');
    Route::get('/ruangan/detail', [RuanganController::class, 'detail'])->name('ruangan.detail');
    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
    Route::get('/jadwal/detail', [JadwalController::class, 'detail'])->name('jadwal.detail');
});

require __DIR__.'/auth.php';

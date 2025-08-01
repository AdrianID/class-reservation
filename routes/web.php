<?php

// admin
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\FacultySelectionController;

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

// Faculty Selection Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/faculty-selection', [FacultySelectionController::class, 'index'])->name('faculty.selection');
    Route::post('/faculty-selection', [FacultySelectionController::class, 'store'])->name('faculty.selection.store');
    Route::delete('/faculty-selection', [FacultySelectionController::class, 'clear'])->name('faculty.selection.clear');
});

// Admin
Route::prefix('admin')->middleware(['auth', 'verified', 'role:Super Admin,Admin', 'check.faculty'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Room management
    Route::get('/ruangan', [RoomController::class, 'index'])->name('admin.ruangan.index');
    Route::get('/ruangan/create', [RoomController::class, 'create'])->name('admin.ruangan.create');
    Route::post('/ruangan', [RoomController::class, 'store'])->name('admin.ruangan.store');
    Route::get('/ruangan/{id}', [RoomController::class, 'show'])->name('admin.ruangan.show');
    Route::get('/ruangan/{id}/edit', [RoomController::class, 'edit'])->name('admin.ruangan.edit');
    Route::put('/ruangan/{id}', [RoomController::class, 'update'])->name('admin.ruangan.update');
    Route::delete('/ruangan/{id}', [RoomController::class, 'destroy'])->name('admin.ruangan.destroy');

    // API endpoint untuk mendapatkan ruangan berdasarkan fasilitas
    Route::get('/api/ruangan/by-facility', [RoomController::class, 'getRoomsByFacility'])->name('admin.ruangan.by-facility');

    // Calendar management
    Route::get('/calendar', [CalendarController::class, 'index'])->name('admin.calendar.index');
    Route::get('/calendar/events', [CalendarController::class, 'getEvents'])->name('admin.calendar.events');

    // Booking management
    Route::get('/booking', [BookingController::class, 'index'])->name('admin.booking.index');
    Route::get('/booking/{id}', [BookingController::class, 'show'])->name('admin.booking.show');
    Route::post('/booking/{id}/approve', [BookingController::class, 'approve'])->name('admin.booking.approve');
    Route::post('/booking/{id}/reject', [BookingController::class, 'reject'])->name('admin.booking.reject');
    Route::get('/booking/export', [BookingController::class, 'export'])->name('admin.booking.export');

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
    ->middleware(['auth', 'verified', 'role:Mahasiswa,Dosen,Dekan'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Classroom Features - menggunakan controller yang sudah ada

    // Peminjaman Routes
    Route::prefix('peminjaman')->name('peminjaman.')->group(function () {
        Route::get('/', [PeminjamanController::class, 'index'])->name('index');
        Route::get('/create', [PeminjamanController::class, 'create'])->name('create');
        Route::post('/', [PeminjamanController::class, 'store'])->name('store');
    });

    // Ruangan 
    Route::get('/ruangan', [RuanganController::class, 'index'])->name('ruangan.index');
    Route::get('/ruangan/list', [RuanganController::class, 'list'])->name('ruangan.list');
    Route::get('/ruangan/{id}/detail', [RuanganController::class, 'detail'])->name('ruangan.detail');
    Route::get('/ruangan/get-rooms', [RuanganController::class, 'getRooms'])->name('ruangan.get-rooms');

    // Jadwal
    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
    Route::get('/jadwal/detail', [JadwalController::class, 'detail'])->name('jadwal.detail');

    // Route untuk navigasi dari dashboard ke fitur classroom
    Route::get('/classroom/{feature}', [DashboardController::class, 'classroomFeature'])->name('classroom.feature');
});

require __DIR__.'/auth.php';

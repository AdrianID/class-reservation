# 🔐 Panduan Implementasi Middleware Login Berdasarkan Role

## 📋 **Daftar Isi**

1. [Struktur Role System](#struktur-role-system)
2. [Middleware Yang Dibuat](#middleware-yang-dibuat)
3. [Routing Protection](#routing-protection)
4. [Frontend Components](#frontend-components)
5. [Cara Penggunaan](#cara-penggunaan)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 **Struktur Role System**

### **Role Hierarchy:**
```
📊 Super Admin    → Full access (semua fitur)
📊 Admin          → Full access (semua fitur)
👔 Dekan          → User access + approve bookings
📚 Dosen          → User access (booking, jadwal)
🎓 Mahasiswa      → User access (booking, jadwal)
```

### **Database Structure:**
```sql
-- Roles Table
roles: id, role_name, description, created_at, updated_at, deleted_at

-- Users Table  
users: id, full_name, email, role_id, ...

-- Relationship
User belongsTo Role
Role hasMany Users
```

---

## 🛡️ **Middleware Yang Dibuat**

### **1. RoleMiddleware** (`app/Http/Middleware/RoleMiddleware.php`)

**Fungsi:** Melindungi routes berdasarkan role pengguna

**Cara Kerja:**
- Cek apakah user sudah login
- Load relationship role dari database
- Validasi apakah user memiliki role yang diizinkan
- Redirect ke halaman yang sesuai jika tidak memiliki akses

**Penggunaan:**
```php
// Single role
Route::middleware(['auth', 'role:Admin'])->group(function () {
    // Routes hanya untuk Admin
});

// Multiple roles
Route::middleware(['auth', 'role:Admin,Super Admin'])->group(function () {
    // Routes untuk Admin dan Super Admin
});
```

### **2. RedirectIfAuthenticated** (`app/Http/Middleware/RedirectIfAuthenticated.php`)

**Fungsi:** Redirect user yang sudah login ke halaman yang sesuai dengan role mereka

**Cara Kerja:**
- Cek apakah user sudah login
- Load role user
- Redirect berdasarkan role:
  - **Admin/Super Admin** → `/admin/dashboard`
  - **Mahasiswa/Dosen/Dekan** → `/dashboard`

---

## 🛤️ **Routing Protection**

### **Admin Routes** (`routes/web.php`)
```php
// Admin routes - hanya Super Admin dan Admin
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'role:Super Admin,Admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::resource('ruangan', RoomController::class);
        Route::resource('booking', BookingController::class);
        // ... admin routes lainnya
    });
```

### **User Routes** (`routes/web.php`)
```php
// User routes - Mahasiswa, Dosen, Dekan
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:Mahasiswa,Dosen,Dekan'])
    ->name('dashboard');

Route::middleware(['auth', 'role:Mahasiswa,Dosen,Dekan'])
    ->group(function () {
        Route::get('/ruangan', [RuanganController::class, 'index']);
        Route::get('/jadwal', [JadwalController::class, 'index']);
        Route::get('/peminjaman', [PeminjamanController::class, 'index']);
        // ... user routes lainnya
    });
```

---

## 🧩 **Frontend Components**

### **1. Role Utils** (`resources/js/utils/roleUtils.js`)

**Fungsi:** Utility functions untuk mengecek role di frontend

**Available Functions:**
```javascript
// Basic role checking
hasRole(user, 'Admin')                    // Single role
hasRole(user, ['Admin', 'Super Admin'])  // Multiple roles

// Specific role checks
isAdmin(user)        // Super Admin atau Admin
isMahasiswa(user)    // Mahasiswa
isDosen(user)        // Dosen
isDekan(user)        // Dekan
isAkademisi(user)    // Dosen atau Dekan
isUser(user)         // Mahasiswa, Dosen, atau Dekan

// Helper functions
getRoleName(user)      // Nama role
getRoleColor(user)     // Warna untuk badge
getDashboardUrl(user)  // URL dashboard berdasarkan role
canBookRoom(user)      // Apakah bisa booking ruangan
canApproveBooking(user) // Apakah bisa approve booking
```

### **2. RoleGuard Component** (`resources/js/components/auth/RoleGuard.jsx`)

**Fungsi:** Melindungi komponen React berdasarkan role

**Penggunaan:**
```jsx
import RoleGuard, { AdminOnly, MahasiswaOnly } from '@/components/auth/RoleGuard';

// Basic usage
<RoleGuard roles={['Admin', 'Super Admin']}>
    <AdminPanel />
</RoleGuard>

// With fallback
<RoleGuard 
    roles={['Admin']} 
    fallback={<div>Anda tidak memiliki akses</div>}
>
    <AdminContent />
</RoleGuard>

// Predefined guards
<AdminOnly>
    <AdminMenu />
</AdminOnly>

<MahasiswaOnly>
    <MahasiswaContent />
</MahasiswaOnly>
```

### **3. RoleBadge Component** (`resources/js/components/auth/RoleBadge.jsx`)

**Fungsi:** Menampilkan badge role pengguna

**Penggunaan:**
```jsx
import RoleBadge, { RoleBadgeWithIcon } from '@/components/auth/RoleBadge';

// Basic badge
<RoleBadge user={user} />

// With custom size and variant
<RoleBadge user={user} size="sm" variant="outline" />

// With icon
<RoleBadgeWithIcon user={user} />
```

---

## 🚀 **Cara Penggunaan**

### **1. Backend - Melindungi Routes**

```php
// Dalam routes/web.php
Route::middleware(['auth', 'role:Admin,Super Admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
});

// Dalam Controller
public function index()
{
    // Hanya admin yang bisa akses method ini
    $users = User::with('role')->get();
    return Inertia::render('Admin/Users/Index', compact('users'));
}
```

### **2. Frontend - Conditional Rendering**

```jsx
import { usePage } from '@inertiajs/react';
import { isAdmin, canBookRoom } from '@/utils/roleUtils';
import RoleGuard from '@/components/auth/RoleGuard';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div>
            <h1>Dashboard</h1>
            
            {/* Conditional rendering */}
            {isAdmin(user) && (
                <AdminPanel />
            )}
            
            {/* Using RoleGuard */}
            <RoleGuard roles={['Dosen', 'Dekan']}>
                <DosenPanel />
            </RoleGuard>
            
            {/* Feature-based checking */}
            {canBookRoom(user) && (
                <BookingButton />
            )}
        </div>
    );
}
```

### **3. Layout Selection**

```jsx
// Dalam pages/Dashboard.jsx
import { usePage } from '@inertiajs/react';
import { isAdmin } from '@/utils/roleUtils';
import AdminLayout from '@/components/Layouts/AdminLayout';
import UserLayout from '@/components/Layouts/UserLayout';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    
    const Layout = isAdmin(user) ? AdminLayout : UserLayout;
    
    return (
        <Layout>
            <DashboardContent />
        </Layout>
    );
}
```

---

## 🧪 **Testing**

### **1. Test Authentication Flow**

```bash
# Test login dengan role berbeda
php artisan tinker

# Create test users
$admin = User::create([
    'full_name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'role_id' => 1, // Admin role
]);

$mahasiswa = User::create([
    'full_name' => 'Mahasiswa Test', 
    'email' => 'mahasiswa@test.com',
    'password' => bcrypt('password'),
    'role_id' => 5, // Mahasiswa role
]);
```

### **2. Test Role Middleware**

```php
// Test akses admin route dengan user biasa
// Harus redirect ke dashboard user
GET /admin/dashboard (sebagai mahasiswa)
// Expected: Redirect ke /dashboard

// Test akses user route dengan admin
// Harus redirect ke admin dashboard  
GET /dashboard (sebagai admin)
// Expected: Redirect ke /admin/dashboard
```

### **3. Test Frontend Components**

```jsx
// Test RoleGuard
<RoleGuard roles={['Admin']}>
    <div data-testid="admin-content">Admin Content</div>
</RoleGuard>

// Test dengan Jest
test('RoleGuard shows content for admin', () => {
    const adminUser = { role: { role_name: 'Admin' } };
    render(<RoleGuard roles={['Admin']} user={adminUser}>Content</RoleGuard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
});
```

---

## 🔧 **Troubleshooting**

### **Problem 1: User tidak punya role**
```
Error: Cannot read property 'role_name' of null
```

**Solution:**
```php
// Pastikan user_id dan role_id sudah diset saat registrasi
// Atau buat migration untuk set default role

// Dalam RegisteredUserController
$user = User::create([
    'full_name' => $request->full_name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
    'role_id' => 5, // Default: Mahasiswa
]);
```

### **Problem 2: Infinite redirect loop**
```
Too many redirects
```

**Solution:**
```php
// Check middleware order dan ensure tidak ada conflict
// Pastikan route dashboard dan admin.dashboard ada

// Dalam routes/web.php
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->name('admin.dashboard');
```

### **Problem 3: Role tidak ter-load di frontend**
```
user.role is undefined
```

**Solution:**
```php
// Ensure HandleInertiaRequests load role
// File: app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    $user = $request->user();
    
    if ($user) {
        $user->load('role'); // Load relationship
    }

    return [
        'auth' => [
            'user' => $user,
        ],
    ];
}
```

### **Problem 4: Seeder role tidak jalan**
```
Role table empty
```

**Solution:**
```bash
# Run seeder
php artisan db:seed --class=RoleSeeder

# Atau run semua seeder
php artisan db:seed
```

---

## 📚 **Best Practices**

1. **Always validate role on both frontend and backend**
2. **Use middleware for route protection**
3. **Use RoleGuard for component protection**
4. **Load user role relationship to avoid N+1 queries**
5. **Provide meaningful error messages**
6. **Test all role scenarios**
7. **Use feature-based permissions for complex logic**

---

## 🎯 **Next Steps**

1. **Add permission system** untuk granular control
2. **Add audit logging** untuk track user actions
3. **Add role hierarchy** untuk inheritance
4. **Add dynamic role assignment** dari admin panel
5. **Add role-based menu generation**

---

**📞 Need Help?**

Jika ada pertanyaan atau masalah dalam implementasi, silakan tanyakan! 
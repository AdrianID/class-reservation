<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get role IDs
        $superAdminRoleId = DB::table('roles')->where('role_name', 'Super Admin')->value('id');
        $adminRoleId = DB::table('roles')->where('role_name', 'Admin')->value('id');
        $dekanRoleId = DB::table('roles')->where('role_name', 'Dekan')->value('id');
        $dosenRoleId = DB::table('roles')->where('role_name', 'Dosen')->value('id');
        $mahasiswaRoleId = DB::table('roles')->where('role_name', 'Mahasiswa')->value('id');

        $users = [
            // Super Admin
            [
                'full_name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password123'),
                'identity_number' => 'SA001',
                'whatsapp_number' => '081234567890',
                'role_id' => $superAdminRoleId,
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Admin
            [
                'full_name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'identity_number' => 'AD001',
                'whatsapp_number' => '081234567891',
                'role_id' => $adminRoleId,
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Dekan
            [
                'full_name' => 'Prof. Dr. John Doe',
                'email' => 'dekan@example.com',
                'password' => Hash::make('password123'),
                'identity_number' => 'DK001',
                'whatsapp_number' => '081234567892',
                'role_id' => $dekanRoleId,
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Dosen
            [
                'full_name' => 'Dr. Jane Smith',
                'email' => 'dosen@example.com',
                'password' => Hash::make('password123'),
                'identity_number' => 'DS001',
                'whatsapp_number' => '081234567893',
                'role_id' => $dosenRoleId,
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Mahasiswa
            [
                'full_name' => 'Budi Santoso',
                'email' => 'mahasiswa@example.com',
                'password' => Hash::make('password123'),
                'identity_number' => '2023001',
                'whatsapp_number' => '081234567894',
                'role_id' => $mahasiswaRoleId,
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}

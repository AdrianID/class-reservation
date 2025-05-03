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
        $users = [
            // Super Admin
            [
                'full_name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password_hash' => Hash::make('password123'),
                'identity_number' => 'SA001',
                'whatsapp_number' => '081234567890',
                'role_id' => 1, // Super Admin
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Admin
            [
                'full_name' => 'Admin',
                'email' => 'admin@example.com',
                'password_hash' => Hash::make('password123'),
                'identity_number' => 'AD001',
                'whatsapp_number' => '081234567891',
                'role_id' => 2, // Admin
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Dekan
            [
                'full_name' => 'Prof. Dr. John Doe',
                'email' => 'dekan@example.com',
                'password_hash' => Hash::make('password123'),
                'identity_number' => 'DK001',
                'whatsapp_number' => '081234567892',
                'role_id' => 3, // Dekan
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Dosen
            [
                'full_name' => 'Dr. Jane Smith',
                'email' => 'dosen@example.com',
                'password_hash' => Hash::make('password123'),
                'identity_number' => 'DS001',
                'whatsapp_number' => '081234567893',
                'role_id' => 4, // Dosen
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Mahasiswa
            [
                'full_name' => 'Budi Santoso',
                'email' => 'mahasiswa@example.com',
                'password_hash' => Hash::make('password123'),
                'identity_number' => '2023001',
                'whatsapp_number' => '081234567894',
                'role_id' => 5, // Mahasiswa
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}

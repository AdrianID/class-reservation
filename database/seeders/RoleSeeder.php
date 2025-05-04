<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'role_name' => 'Super Admin',
                'description' => 'System super administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_name' => 'Admin',
                'description' => 'System administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_name' => 'Dekan',
                'description' => 'Dekan role for booking rooms',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_name' => 'Dosen',
                'description' => 'Lecturer role for booking rooms',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_name' => 'Mahasiswa',
                'description' => 'Student role for booking rooms',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);
    }
} 
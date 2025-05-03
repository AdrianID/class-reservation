<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        $buildings = [
            [
                'faculty_id' => 1, // Fakultas Teknik
                'building_name' => 'Gedung A',
                'description' => 'Gedung utama Fakultas Teknik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => 1, // Fakultas Teknik
                'building_name' => 'Gedung B',
                'description' => 'Gedung laboratorium Fakultas Teknik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => 2, // Fakultas Ekonomi
                'building_name' => 'Gedung C',
                'description' => 'Gedung utama Fakultas Ekonomi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => 3, // Fakultas Ekonomi
                'building_name' => 'Gedung D',
                'description' => 'Gedung laboratorium Fakultas Hukum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('buildings')->insert($buildings);
    }
} 
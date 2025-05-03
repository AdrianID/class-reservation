<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        // Get faculty IDs
        $teknikId = DB::table('faculties')->where('faculty_name', 'Fakultas Teknik')->value('id');
        $ekonomiId = DB::table('faculties')->where('faculty_name', 'Fakultas Ekonomi')->value('id');
        $hukumId = DB::table('faculties')->where('faculty_name', 'Fakultas Hukum')->value('id');
        $kedokteranId = DB::table('faculties')->where('faculty_name', 'Fakultas Kedokteran')->value('id');
        $fisipId = DB::table('faculties')->where('faculty_name', 'Fakultas Ilmu Sosial dan Politik')->value('id');

        $buildings = [
            [
                'faculty_id' => $teknikId,
                'building_name' => 'Gedung Teknik A',
                'description' => 'Gedung utama Fakultas Teknik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => $ekonomiId,
                'building_name' => 'Gedung Ekonomi',
                'description' => 'Gedung utama Fakultas Ekonomi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => $hukumId,
                'building_name' => 'Gedung Hukum',
                'description' => 'Gedung utama Fakultas Hukum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => $kedokteranId,
                'building_name' => 'Gedung Kedokteran',
                'description' => 'Gedung utama Fakultas Kedokteran',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_id' => $fisipId,
                'building_name' => 'Gedung FISIP',
                'description' => 'Gedung utama Fakultas Ilmu Sosial dan Politik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('buildings')->insert($buildings);
    }
} 
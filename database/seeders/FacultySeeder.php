<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $faculties = [
            [
                'faculty_name' => 'Fakultas Teknik',
                'description' => 'Fakultas yang fokus pada bidang teknik dan teknologi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_name' => 'Fakultas Ekonomi',
                'description' => 'Fakultas yang fokus pada bidang ekonomi dan bisnis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'faculty_name' => 'Fakultas Hukum',
                'description' => 'Fakultas yang fokus pada bidang hukum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('faculties')->insert($faculties);
    }
} 
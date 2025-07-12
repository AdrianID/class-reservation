<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'category_name' => 'Kelas',
                'description' => 'Ruang kelas untuk kegiatan belajar mengajar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Laboratorium',
                'description' => 'Ruang laboratorium untuk praktikum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Ruang Seminar',
                'description' => 'Ruang untuk kegiatan seminar dan presentasi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Ruang Rapat',
                'description' => 'Ruang untuk kegiatan rapat',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Ruang Baca',
                'description' => 'Ruang untuk kegiatan membaca dan belajar mandiri',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('room_categories')->insert($categories);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'building_id' => 1, // Gedung A
                'category_id' => 1, // Kelas
                'room_code' => 'A101',
                'room_name' => 'Ruang Kelas A101',
                'location_detail' => 'Lantai 1',
                'capacity' => 40,
                'description' => 'Ruang kelas standar',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => 1, // Gedung A
                'category_id' => 2, // Laboratorium
                'room_code' => 'A201',
                'room_name' => 'Lab Komputer A201',
                'location_detail' => 'Lantai 2',
                'capacity' => 30,
                'description' => 'Laboratorium komputer',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => 2, // Gedung B
                'category_id' => 3, // Ruang Seminar
                'room_code' => 'B301',
                'room_name' => 'Ruang Seminar B301',
                'location_detail' => 'Lantai 3',
                'capacity' => 100,
                'description' => 'Ruang seminar besar',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('rooms')->insert($rooms);
    }
} 
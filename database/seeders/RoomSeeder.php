<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Get building and category IDs
        $teknikBuildingId = DB::table('buildings')->where('building_name', 'Gedung Teknik A')->value('id');
        $ekonomiBuildingId = DB::table('buildings')->where('building_name', 'Gedung Ekonomi')->value('id');
        $hukumBuildingId = DB::table('buildings')->where('building_name', 'Gedung Hukum')->value('id');
        $kedokteranBuildingId = DB::table('buildings')->where('building_name', 'Gedung Kedokteran')->value('id');
        $fisipBuildingId = DB::table('buildings')->where('building_name', 'Gedung FISIP')->value('id');

        $kelasCategoryId = DB::table('room_categories')->where('category_name', 'Kelas')->value('id');
        $labCategoryId = DB::table('room_categories')->where('category_name', 'Laboratorium')->value('id');
        $seminarCategoryId = DB::table('room_categories')->where('category_name', 'Ruang Seminar')->value('id');
        $rapatCategoryId = DB::table('room_categories')->where('category_name', 'Ruang Rapat')->value('id');
        $bacaCategoryId = DB::table('room_categories')->where('category_name', 'Ruang Baca')->value('id');

        $rooms = [
            [
                'building_id' => $teknikBuildingId,
                'category_id' => $kelasCategoryId,
                'room_code' => 'TK-101',
                'room_name' => 'Ruang Kelas Teknik 101',
                'location_detail' => 'Lantai 1',
                'capacity' => 40,
                'description' => 'Ruang kelas untuk mata kuliah teknik',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => $teknikBuildingId,
                'category_id' => $labCategoryId,
                'room_code' => 'TK-LAB-101',
                'room_name' => 'Laboratorium Komputer',
                'location_detail' => 'Lantai 2',
                'capacity' => 30,
                'description' => 'Laboratorium komputer untuk praktikum',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => $ekonomiBuildingId,
                'category_id' => $kelasCategoryId,
                'room_code' => 'EK-101',
                'room_name' => 'Ruang Kelas Ekonomi 101',
                'location_detail' => 'Lantai 1',
                'capacity' => 50,
                'description' => 'Ruang kelas untuk mata kuliah ekonomi',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => $hukumBuildingId,
                'category_id' => $seminarCategoryId,
                'room_code' => 'HK-SEM-101',
                'room_name' => 'Ruang Seminar Hukum',
                'location_detail' => 'Lantai 3',
                'capacity' => 100,
                'description' => 'Ruang seminar untuk kegiatan hukum',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'building_id' => $fisipBuildingId,
                'category_id' => $rapatCategoryId,
                'room_code' => 'FS-RPT-101',
                'room_name' => 'Ruang Rapat FISIP',
                'location_detail' => 'Lantai 2',
                'capacity' => 20,
                'description' => 'Ruang rapat untuk kegiatan FISIP',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('rooms')->insert($rooms);
    }
} 
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomFacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            [
                'room_id' => 1, // A101
                'facility_name' => 'Proyektor',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 1, // A101
                'facility_name' => 'AC',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 2, // A201
                'facility_name' => 'Komputer',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 2, // A201
                'facility_name' => 'Proyektor',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 3, // B301
                'facility_name' => 'Sound System',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 3, // B301
                'facility_name' => 'Proyektor',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('room_facilities')->insert($facilities);
    }
} 
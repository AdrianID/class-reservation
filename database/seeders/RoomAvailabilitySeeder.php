<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        // Get room IDs
        $kelasTeknikId = DB::table('rooms')->where('room_code', 'TK-101')->value('id');
        $labKomputerId = DB::table('rooms')->where('room_code', 'TK-LAB-101')->value('id');
        $kelasEkonomiId = DB::table('rooms')->where('room_code', 'EK-101')->value('id');
        $seminarHukumId = DB::table('rooms')->where('room_code', 'HK-SEM-101')->value('id');
        $rapatFisipId = DB::table('rooms')->where('room_code', 'FS-RPT-101')->value('id');

        $availabilities = [
            [
                'room_id' => $kelasTeknikId,
                'day' => 'monday',
                'start_time' => '07:00:00',
                'end_time' => '21:00:00',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $kelasTeknikId,
                'day' => 'tuesday',
                'start_time' => '07:00:00',
                'end_time' => '21:00:00',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $labKomputerId,
                'day' => 'wednesday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $seminarHukumId,
                'day' => 'thursday',
                'start_time' => '08:00:00',
                'end_time' => '21:00:00',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $rapatFisipId,
                'day' => 'friday',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('room_availabilities')->insert($availabilities);
    }
} 
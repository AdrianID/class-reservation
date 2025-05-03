<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomFacilitySeeder extends Seeder
{
    public function run(): void
    {
        // Get room IDs
        $kelasTeknikId = DB::table('rooms')->where('room_code', 'TK-101')->value('id');
        $labKomputerId = DB::table('rooms')->where('room_code', 'TK-LAB-101')->value('id');
        $kelasEkonomiId = DB::table('rooms')->where('room_code', 'EK-101')->value('id');
        $seminarHukumId = DB::table('rooms')->where('room_code', 'HK-SEM-101')->value('id');
        $rapatFisipId = DB::table('rooms')->where('room_code', 'FS-RPT-101')->value('id');

        $facilities = [
            [
                'room_id' => $kelasTeknikId,
                'facility_name' => 'Proyektor',
                'quantity' => 1,
                'description' => 'Proyektor untuk presentasi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $kelasTeknikId,
                'facility_name' => 'Papan Tulis',
                'quantity' => 1,
                'description' => 'Papan tulis putih',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $labKomputerId,
                'facility_name' => 'Komputer',
                'quantity' => 30,
                'description' => 'Komputer untuk praktikum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $seminarHukumId,
                'facility_name' => 'Sound System',
                'quantity' => 1,
                'description' => 'Sistem audio untuk seminar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => $rapatFisipId,
                'facility_name' => 'Meja Rapat',
                'quantity' => 1,
                'description' => 'Meja rapat besar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('room_facilities')->insert($facilities);
    }
} 
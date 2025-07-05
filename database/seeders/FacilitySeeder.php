<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facilities = [
            // Audio Visual
            [
                'facility_name' => 'Proyektor',
                'facility_code' => 'PRJ',
                'description' => 'Proyektor untuk presentasi',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Layar Proyektor',
                'facility_code' => 'SCRN',
                'description' => 'Layar untuk proyektor',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Microphone',
                'facility_code' => 'MIC',
                'description' => 'Microphone untuk presentasi',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Speaker',
                'facility_code' => 'SPK',
                'description' => 'Speaker audio',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Whiteboard',
                'facility_code' => 'WB',
                'description' => 'Papan tulis putih',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Blackboard',
                'facility_code' => 'BB',
                'description' => 'Papan tulis hitam',
                'unit' => 'unit',
                'is_active' => true,
            ],
            
            // Furniture
            [
                'facility_name' => 'Kursi',
                'facility_code' => 'CHR',
                'description' => 'Kursi untuk peserta',
                'unit' => 'piece',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Meja',
                'facility_code' => 'TBL',
                'description' => 'Meja untuk peserta',
                'unit' => 'piece',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Podium',
                'facility_code' => 'PDM',
                'description' => 'Podium untuk presenter',
                'unit' => 'unit',
                'is_active' => true,
            ],
            
            // Technology
            [
                'facility_name' => 'Komputer',
                'facility_code' => 'PC',
                'description' => 'Komputer untuk presentasi',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'WiFi',
                'facility_code' => 'WIFI',
                'description' => 'Koneksi internet wireless',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Stop Kontak',
                'facility_code' => 'PLG',
                'description' => 'Stop kontak listrik',
                'unit' => 'piece',
                'is_active' => true,
            ],
            
            // Climate Control
            [
                'facility_name' => 'AC',
                'facility_code' => 'AC',
                'description' => 'Air Conditioner',
                'unit' => 'unit',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Kipas Angin',
                'facility_code' => 'FAN',
                'description' => 'Kipas angin',
                'unit' => 'unit',
                'is_active' => true,
            ],
            
            // Laboratory Equipment
            [
                'facility_name' => 'Laboratorium Komputer',
                'facility_code' => 'COMPLAB',
                'description' => 'Fasilitas laboratorium komputer',
                'unit' => 'set',
                'is_active' => true,
            ],
            [
                'facility_name' => 'Laboratorium Bahasa',
                'facility_code' => 'LANGLAB',
                'description' => 'Fasilitas laboratorium bahasa',
                'unit' => 'set',
                'is_active' => true,
            ],
        ];

        DB::table('facilities')->insert($facilities);
    }
}

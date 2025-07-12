<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Get all buildings
        $buildings = DB::table('buildings')->get();

        // Get all categories
        $categories = DB::table('room_categories')->get();
        $categoryMap = [];
        foreach ($categories as $category) {
            $categoryMap[$category->category_name] = $category->id;
        }

        $rooms = [];

        // Facility codes for room numbering
        $facilityCodes = [
            'Kelas' => 'KLS',
            'Laboratorium' => 'LAB',
            'Ruang Seminar' => 'SEM',
            'Ruang Rapat' => 'RPT',
            'Ruang Baca' => 'BCA'
        ];

        foreach ($buildings as $building) {
            $buildingAbbr = $this->getBuildingAbbr($building->building_name);

            // Add classrooms (3-5 per building)
            $classCount = rand(3, 5);
            for ($i = 1; $i <= $classCount; $i++) {
                $rooms[] = [
                    'building_id' => $building->id,
                    'category_id' => $categoryMap['Kelas'],
                    'room_code' => $buildingAbbr . '-KLS-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'room_name' => 'Ruang Kelas ' . $building->building_name . ' ' . $i,
                    'location_detail' => 'Lantai ' . rand(1, 3),
                    'capacity' => rand(30, 60),
                    'description' => 'Ruang kelas reguler',
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Add 1-2 laboratories for technical buildings
            if (str_contains($building->building_name, 'Teknik') ||
                str_contains($building->building_name, 'Lab') ||
                str_contains($building->building_name, 'Studio')) {
                $labCount = rand(1, 2);
                for ($i = 1; $i <= $labCount; $i++) {
                    $rooms[] = [
                        'building_id' => $building->id,
                        'category_id' => $categoryMap['Laboratorium'],
                        'room_code' => $buildingAbbr . '-LAB-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                        'room_name' => 'Laboratorium ' . $building->building_name . ' ' . $i,
                        'location_detail' => 'Lantai ' . rand(1, 2),
                        'capacity' => rand(20, 40),
                        'description' => 'Laboratorium praktikum',
                        'status' => 'available',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Add seminar rooms for main buildings
            if (str_contains($building->building_name, 'Utama') ||
                str_contains($building->building_name, 'Pascasarjana')) {
                $rooms[] = [
                    'building_id' => $building->id,
                    'category_id' => $categoryMap['Ruang Seminar'],
                    'room_code' => $buildingAbbr . '-SEM-01',
                    'room_name' => 'Ruang Seminar ' . $building->building_name,
                    'location_detail' => 'Lantai ' . rand(2, 4),
                    'capacity' => rand(80, 150),
                    'description' => 'Ruang seminar besar',
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Add meeting rooms (1 per building)
            $rooms[] = [
                'building_id' => $building->id,
                'category_id' => $categoryMap['Ruang Rapat'],
                'room_code' => $buildingAbbr . '-RPT-01',
                'room_name' => 'Ruang Rapat ' . $building->building_name,
                'location_detail' => 'Lantai ' . rand(1, 2),
                'capacity' => rand(10, 20),
                'description' => 'Ruang rapat staf',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Add reading rooms for academic buildings
            if (!str_contains($building->building_name, 'Rumah Sakit')) {
                $rooms[] = [
                    'building_id' => $building->id,
                    'category_id' => $categoryMap['Ruang Baca'],
                    'room_code' => $buildingAbbr . '-BCA-01',
                    'room_name' => 'Ruang Baca ' . $building->building_name,
                    'location_detail' => 'Lantai ' . rand(1, 2),
                    'capacity' => rand(15, 30),
                    'description' => 'Ruang baca dan diskusi',
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Special facilities for specific buildings
        $specialBuildings = [
            'Laboratorium Mesin' => [
                'category' => 'Laboratorium',
                'rooms' => [
                    ['code' => 'LABMES-SP1', 'name' => 'Lab CNC', 'capacity' => 15],
                    ['code' => 'LABMES-SP2', 'name' => 'Lab Mekanika Fluida', 'capacity' => 20],
                ]
            ],
            'Laboratorium Elektro' => [
                'category' => 'Laboratorium',
                'rooms' => [
                    ['code' => 'LABELE-SP1', 'name' => 'Lab Mikroprosesor', 'capacity' => 20],
                    ['code' => 'LABELE-SP2', 'name' => 'Lab Jaringan Komputer', 'capacity' => 25],
                ]
            ],
            'Studio Arsitektur' => [
                'category' => 'Laboratorium',
                'rooms' => [
                    ['code' => 'STUAR-SP1', 'name' => 'Studio Desain', 'capacity' => 30],
                    ['code' => 'STUAR-SP2', 'name' => 'Studio Maket', 'capacity' => 25],
                ]
            ],
            'Rumah Sakit Pendidikan' => [
                'category' => 'Laboratorium',
                'rooms' => [
                    ['code' => 'RS-SIM1', 'name' => 'Simulasi ICU', 'capacity' => 10],
                    ['code' => 'RS-SIM2', 'name' => 'Simulasi Kamar Operasi', 'capacity' => 15],
                    ['code' => 'RS-SEM', 'name' => 'Seminar Kesehatan', 'capacity' => 50],
                ]
            ],
        ];

        foreach ($specialBuildings as $buildingName => $spec) {
            $building = DB::table('buildings')->where('building_name', $buildingName)->first();
            if ($building) {
                foreach ($spec['rooms'] as $room) {
                    $rooms[] = [
                        'building_id' => $building->id,
                        'category_id' => $categoryMap[$spec['category']],
                        'room_code' => $room['code'],
                        'room_name' => $room['name'],
                        'location_detail' => 'Lantai ' . rand(1, 3),
                        'capacity' => $room['capacity'],
                        'description' => 'Fasilitas khusus',
                        'status' => 'available',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        DB::table('rooms')->insert($rooms);
    }

    private function getBuildingAbbr($buildingName)
    {
        $abbrMap = [
            'Gedung Teknik A' => 'GTA',
            'Gedung Teknik B' => 'GTB',
            'Laboratorium Mesin' => 'LABMES',
            'Laboratorium Elektro' => 'LABELE',
            'Studio Arsitektur' => 'STUAR',
            'Gedung Ekonomi' => 'GEDEK',
            'Gedung Akuntansi' => 'GEDAK',
            'Gedung Pascasarjana Ekonomi' => 'PASEK',
            'Gedung Hukum' => 'GEDHK',
            'Gedung Peradilan Semu' => 'GEDPS',
            'Gedung Pascasarjana Hukum' => 'PASHK',
            'Gedung Kedokteran' => 'GEDDK',
            'Gedung Anatomi' => 'GEDAN',
            'Gedung Biomedik' => 'GEDBM',
            'Gedung Klinik' => 'GEDKL',
            'Rumah Sakit Pendidikan' => 'RS',
            'Gedung FISIP' => 'GEDFS',
            'Gedung Ilmu Komunikasi' => 'GEDIK',
            'Gedung Hubungan Internasional' => 'GEDHI',
            'Gedung Administrasi Publik' => 'GEDAP',
        ];

        return $abbrMap[$buildingName] ?? substr(str_replace(' ', '', $buildingName), 0, 5);
    }
}

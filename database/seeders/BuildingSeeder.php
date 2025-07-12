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
            // Fakultas Teknik
            ['faculty_id' => $teknikId, 'building_name' => 'Gedung Teknik A', 'description' => 'Gedung kuliah utama Teknik'],
            ['faculty_id' => $teknikId, 'building_name' => 'Gedung Teknik B', 'description' => 'Gedung kuliah tambahan Teknik'],
            ['faculty_id' => $teknikId, 'building_name' => 'Laboratorium Mesin', 'description' => 'Lab Teknik Mesin'],
            ['faculty_id' => $teknikId, 'building_name' => 'Laboratorium Elektro', 'description' => 'Lab Teknik Elektro'],
            ['faculty_id' => $teknikId, 'building_name' => 'Studio Arsitektur', 'description' => 'Studio untuk mahasiswa Arsitektur'],

            // Fakultas Ekonomi
            ['faculty_id' => $ekonomiId, 'building_name' => 'Gedung Ekonomi', 'description' => 'Gedung utama Ekonomi'],
            ['faculty_id' => $ekonomiId, 'building_name' => 'Gedung Akuntansi', 'description' => 'Gedung Prodi Akuntansi'],
            ['faculty_id' => $ekonomiId, 'building_name' => 'Gedung Pascasarjana Ekonomi', 'description' => 'Untuk program S2 dan S3'],

            // Fakultas Hukum
            ['faculty_id' => $hukumId, 'building_name' => 'Gedung Hukum', 'description' => 'Gedung kuliah hukum'],
            ['faculty_id' => $hukumId, 'building_name' => 'Gedung Peradilan Semu', 'description' => 'Untuk praktik simulasi sidang'],
            ['faculty_id' => $hukumId, 'building_name' => 'Gedung Pascasarjana Hukum', 'description' => 'Gedung S2 dan S3'],

            // Fakultas Kedokteran
            ['faculty_id' => $kedokteranId, 'building_name' => 'Gedung Kedokteran', 'description' => 'Gedung kuliah utama FK'],
            ['faculty_id' => $kedokteranId, 'building_name' => 'Gedung Anatomi', 'description' => 'Untuk praktik anatomi dan praktikum'],
            ['faculty_id' => $kedokteranId, 'building_name' => 'Gedung Biomedik', 'description' => 'Lab riset biomedis'],
            ['faculty_id' => $kedokteranId, 'building_name' => 'Gedung Klinik', 'description' => 'Lab klinik dan simulasi pasien'],
            ['faculty_id' => $kedokteranId, 'building_name' => 'Rumah Sakit Pendidikan', 'description' => 'Fasilitas rumah sakit untuk praktik'],

            // FISIP
            ['faculty_id' => $fisipId, 'building_name' => 'Gedung FISIP', 'description' => 'Gedung utama FISIP'],
            ['faculty_id' => $fisipId, 'building_name' => 'Gedung Ilmu Komunikasi', 'description' => 'Gedung khusus jurusan Komunikasi'],
            ['faculty_id' => $fisipId, 'building_name' => 'Gedung Hubungan Internasional', 'description' => 'Untuk jurusan HI dan PKN'],
            ['faculty_id' => $fisipId, 'building_name' => 'Gedung Administrasi Publik', 'description' => 'Gedung jurusan Administrasi'],
        ];

        DB::table('buildings')->insert($buildings);
    }
}

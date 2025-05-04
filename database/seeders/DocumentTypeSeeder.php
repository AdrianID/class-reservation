<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'type_name' => 'Surat Permohonan',
                'description' => 'Surat permohonan penggunaan ruangan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_name' => 'Surat Pengantar',
                'description' => 'Surat pengantar dari fakultas',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_name' => 'Rencana Kegiatan',
                'description' => 'Rencana kegiatan yang akan dilaksanakan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_name' => 'Daftar Peserta',
                'description' => 'Daftar peserta kegiatan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_name' => 'Lainnya',
                'description' => 'Dokumen pendukung lainnya',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('document_types')->insert($types);
    }
} 
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
                'type_name' => 'Surat Tugas',
                'description' => 'Surat tugas untuk kegiatan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_name' => 'Proposal',
                'description' => 'Proposal kegiatan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('document_types')->insert($types);
    }
} 
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
        {
            DB::table('booking_types')->insert([
                [
                    'name' => 'Ruangan',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Fasilitas',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $availabilities = [
            [
                'room_id' => 1, // A101
                'day_of_week' => 'Monday',
                'start_time' => '07:00:00',
                'end_time' => '17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 1, // A101
                'day_of_week' => 'Tuesday',
                'start_time' => '07:00:00',
                'end_time' => '17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 2, // A201
                'day_of_week' => 'Monday',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 2, // A201
                'day_of_week' => 'Wednesday',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_id' => 3, // B301
                'day_of_week' => 'Friday',
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('room_availabilities')->insert($availabilities);
    }
} 
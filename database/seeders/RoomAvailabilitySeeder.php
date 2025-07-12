<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        // Dapatkan semua ruangan
        $rooms = DB::table('rooms')->get();

        $availabilities = [];

        // Jadwal standar untuk ruangan kelas
        $classroomSchedule = [
            ['day' => 'monday', 'start' => '07:00:00', 'end' => '21:00:00'],
            ['day' => 'tuesday', 'start' => '07:00:00', 'end' => '21:00:00'],
            ['day' => 'wednesday', 'start' => '07:00:00', 'end' => '21:00:00'],
            ['day' => 'thursday', 'start' => '07:00:00', 'end' => '21:00:00'],
            ['day' => 'friday', 'start' => '07:00:00', 'end' => '17:00:00'],
            ['day' => 'saturday', 'start' => '08:00:00', 'end' => '15:00:00'],
        ];

        // Jadwal khusus untuk laboratorium
        $labSchedule = [
            ['day' => 'monday', 'start' => '08:00:00', 'end' => '17:00:00'],
            ['day' => 'tuesday', 'start' => '08:00:00', 'end' => '17:00:00'],
            ['day' => 'wednesday', 'start' => '08:00:00', 'end' => '17:00:00'],
            ['day' => 'thursday', 'start' => '08:00:00', 'end' => '17:00:00'],
            ['day' => 'friday', 'start' => '08:00:00', 'end' => '16:00:00'],
        ];

        // Jadwal khusus untuk rumah sakit
        $hospitalSchedule = [
            ['day' => 'monday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'tuesday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'wednesday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'thursday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'friday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'saturday', 'start' => '00:00:00', 'end' => '23:59:59'],
            ['day' => 'sunday', 'start' => '00:00:00', 'end' => '23:59:59'],
        ];

        foreach ($rooms as $room) {
            $category = DB::table('room_categories')
                ->where('id', $room->category_id)
                ->value('category_name');

            // Tentukan jadwal berdasarkan kategori ruangan
            $schedule = [];
            if ($category === 'Laboratorium') {
                $schedule = $labSchedule;
            } elseif (str_contains($room->room_name, 'Rumah Sakit')) {
                $schedule = $hospitalSchedule;
            } else {
                $schedule = $classroomSchedule;
            }

            // Tambahkan jadwal untuk ruangan
            foreach ($schedule as $slot) {
                $availabilities[] = [
                    'room_id' => $room->id,
                    'day' => $slot['day'],
                    'start_time' => $slot['start'],
                    'end_time' => $slot['end'],
                    'is_available' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('room_availabilities')->insert($availabilities);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomFacilitySeeder extends Seeder
{
    public function run(): void
    {
        // Dapatkan semua ruangan
        $rooms = DB::table('rooms')->get();

        $facilities = [];
        $facilityTemplates = [
            'Kelas' => [
                ['name' => 'Proyektor', 'quantity' => 1, 'desc' => 'Proyektor untuk presentasi'],
                ['name' => 'Papan Tulis', 'quantity' => 1, 'desc' => 'Papan tulis putih'],
                ['name' => 'Kursi', 'quantity' => 'capacity', 'desc' => 'Kursi kuliah'],
                ['name' => 'Meja', 'quantity' => 'capacity', 'desc' => 'Meja kuliah'],
                ['name' => 'AC', 'quantity' => 2, 'desc' => 'Air Conditioner'],
            ],
            'Laboratorium' => [
                ['name' => 'Komputer', 'quantity' => 'capacity', 'desc' => 'Komputer untuk praktikum'],
                ['name' => 'Alat Praktikum', 'quantity' => 10, 'desc' => 'Perangkat praktikum'],
                ['name' => 'Proyektor', 'quantity' => 1, 'desc' => 'Proyektor presentasi'],
                ['name' => 'Meja Lab', 'quantity' => 'capacity/2', 'desc' => 'Meja laboratorium'],
            ],
            'Ruang Seminar' => [
                ['name' => 'Sound System', 'quantity' => 1, 'desc' => 'Sistem audio profesional'],
                ['name' => 'Proyektor', 'quantity' => 1, 'desc' => 'Proyektor resolusi tinggi'],
                ['name' => 'Mikrofon', 'quantity' => 3, 'desc' => 'Mikrofon nirkabel'],
                ['name' => 'Podium', 'quantity' => 1, 'desc' => 'Podium pembicara'],
            ],
            'Ruang Rapat' => [
                ['name' => 'Meja Rapat', 'quantity' => 1, 'desc' => 'Meja rapat besar'],
                ['name' => 'Kursi Rapat', 'quantity' => 'capacity', 'desc' => 'Kursi ergonomis'],
                ['name' => 'TV', 'quantity' => 1, 'desc' => 'Televisi layar besar'],
                ['name' => 'Whiteboard', 'quantity' => 1, 'desc' => 'Papan tulis interaktif'],
            ],
            'Ruang Baca' => [
                ['name' => 'Meja Baca', 'quantity' => 'capacity/2', 'desc' => 'Meja baca individual'],
                ['name' => 'Kursi Nyaman', 'quantity' => 'capacity', 'desc' => 'Kursi baca ergonomis'],
                ['name' => 'Lampu Meja', 'quantity' => 'capacity', 'desc' => 'Lampu baca'],
                ['name' => 'Rak Buku', 'quantity' => 5, 'desc' => 'Rak buku referensi'],
            ],
        ];

        foreach ($rooms as $room) {
            $category = DB::table('room_categories')->where('id', $room->category_id)->value('category_name');

            if (!isset($facilityTemplates[$category])) continue;

            foreach ($facilityTemplates[$category] as $template) {
                $quantity = $this->calculateQuantity($template['quantity'], $room->capacity);

                $facilities[] = [
                    'room_id' => $room->id,
                    'facility_name' => $template['name'],
                    'quantity' => $quantity,
                    'description' => $template['desc'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('room_facilities')->insert($facilities);
    }

    private function calculateQuantity($spec, $capacity)
    {
        if ($spec === 'capacity') return $capacity;
        if (str_contains($spec, '/')) {
            $divisor = explode('/', $spec)[1];
            return floor($capacity / (int)$divisor);
        }
        return (int)$spec;
    }
}

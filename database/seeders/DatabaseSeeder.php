<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, seed the roles
        $this->call(RoleSeeder::class);

        // Then seed users that depend on roles
        $this->call(UserSeeder::class);

        // Then seed the rest of the data
        $this->call([
            FacultySeeder::class,
            BuildingSeeder::class,
            RoomCategorySeeder::class,
            RoomSeeder::class,
            RoomFacilitySeeder::class,
            RoomAvailabilitySeeder::class,
            DocumentTypeSeeder::class,
        ]);

        // Finally, seed user-faculty relationships
        $this->call(UserFacultySeeder::class);

        $this->call(FacilitySeeder::class);
    }
}

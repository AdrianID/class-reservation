<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Faculty;
use App\Models\Role;

class UserFacultySeeder extends Seeder
{
    public function run(): void
    {
        // Get roles
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        $adminRole = Role::where('role_name', 'Admin')->first();
        $facultyAdminRole = Role::where('role_name', 'Faculty Admin')->first();

        // Get faculties
        $faculties = Faculty::all();

        // Get users
        $users = User::with('role')->get();

        foreach ($users as $user) {
            // Super admin gets access to all faculties
            if ($user->role->role_name === 'Super Admin') {
                foreach ($faculties as $faculty) {
                    DB::table('user_faculty')->insertOrIgnore([
                        'user_id' => $user->id,
                        'faculty_id' => $faculty->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
            // Faculty admin gets access to specific faculties
            elseif ($user->role->role_name === 'Faculty Admin') {
                // Assign to first faculty for demo
                if ($faculties->count() > 0) {
                    DB::table('user_faculty')->insertOrIgnore([
                        'user_id' => $user->id,
                        'faculty_id' => $faculties->first()->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
            // Regular admin gets access to first 2 faculties for demo
            elseif ($user->role->role_name === 'Admin') {
                $facultiesToAssign = $faculties->take(2);
                foreach ($facultiesToAssign as $faculty) {
                    DB::table('user_faculty')->insertOrIgnore([
                        'user_id' => $user->id,
                        'faculty_id' => $faculty->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}

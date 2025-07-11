<?php

namespace App\Console\Commands;

use App\Models\Facility;
use App\Models\Room;
use App\Models\RoomFacility;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateRoomFacilitiesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:room-facilities';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate old room facilities to new many-to-many structure';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of room facilities...');
        
        // Get all old room facilities
        $oldFacilities = RoomFacility::all();
        
        $this->info("Found {$oldFacilities->count()} old room facilities to migrate");
        
        $migratedCount = 0;
        $errorCount = 0;
        
        foreach ($oldFacilities as $oldFacility) {
            try {
                // Find or create facility in master table
                $facility = Facility::firstOrCreate([
                    'facility_name' => $oldFacility->facility_name,
                ], [
                    'facility_code' => $this->generateFacilityCode($oldFacility->facility_name),
                    'description' => $oldFacility->description,
                    'unit' => $this->guessUnit($oldFacility->facility_name),
                    'is_active' => true,
                ]);
                
                // Create pivot relationship
                $room = Room::find($oldFacility->room_id);
                if ($room) {
                    // Check if relationship already exists
                    $exists = $room->facilities()->where('facility_id', $facility->id)->exists();
                    
                    if (!$exists) {
                        $room->facilities()->attach($facility->id, [
                            'quantity' => $oldFacility->quantity,
                            'notes' => $oldFacility->description,
                        ]);
                        $migratedCount++;
                    } else {
                        $this->warn("Relationship already exists for room {$room->room_name} - facility {$facility->facility_name}");
                    }
                } else {
                    $this->error("Room not found for ID: {$oldFacility->room_id}");
                    $errorCount++;
                }
                
            } catch (\Exception $e) {
                $this->error("Error migrating facility: {$e->getMessage()}");
                $errorCount++;
            }
        }
        
        $this->info("Migration completed!");
        $this->info("Migrated: {$migratedCount} facilities");
        $this->info("Errors: {$errorCount}");
        
        return 0;
    }
    
    private function generateFacilityCode($facilityName)
    {
        // Generate a simple code from facility name
        $words = explode(' ', $facilityName);
        $code = '';
        
        foreach ($words as $word) {
            $code .= strtoupper(substr($word, 0, 2));
        }
        
        // Ensure unique code
        $originalCode = $code;
        $counter = 1;
        
        while (Facility::where('facility_code', $code)->exists()) {
            $code = $originalCode . $counter;
            $counter++;
        }
        
        return $code;
    }
    
    private function guessUnit($facilityName)
    {
        $facilityName = strtolower($facilityName);
        
        // Common patterns for different units
        if (str_contains($facilityName, 'kursi') || str_contains($facilityName, 'meja')) {
            return 'piece';
        } elseif (str_contains($facilityName, 'lab') || str_contains($facilityName, 'set')) {
            return 'set';
        } elseif (str_contains($facilityName, 'meter')) {
            return 'meter';
        } else {
            return 'unit';
        }
    }
}

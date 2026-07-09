<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WarehousesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('warehouses')->delete();
        
        \DB::table('warehouses')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Dhaka Central Logistics',
                'address' => 'Tejgaon Industrial Area, Dhaka',
                'is_default' => 1,
                'is_active' => 1,
                'created_at' => '2026-06-01 13:00:05.229',
            ),
            1 => 
            array (
                'id' => 2,
                'name' => 'Chittagong Port Storage',
                'address' => 'Agrabad, Chittagong',
                'is_default' => 0,
                'is_active' => 1,
                'created_at' => '2026-06-01 13:00:05.231',
            ),
            2 => 
            array (
                'id' => 3,
                'name' => 'Khulna Distribution Center',
                'address' => 'Sonadanga, Khulna',
                'is_default' => 0,
                'is_active' => 1,
                'created_at' => '2026-06-01 13:00:05.233',
            ),
        ));
        
        
    }
}
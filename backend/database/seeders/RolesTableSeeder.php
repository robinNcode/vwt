<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('roles')->delete();
        
        \DB::table('roles')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'created_at' => '2026-06-01 13:00:04.941',
                'updated_at' => '2026-06-14 12:56:49.366',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'name' => 'Admin',
                'slug' => 'admin',
                'created_at' => '2026-06-01 13:00:04.944',
                'updated_at' => '2026-06-01 13:00:04.944',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'name' => 'Procurement Manager',
                'slug' => 'procurement-manager',
                'created_at' => '2026-06-01 13:00:04.948',
                'updated_at' => '2026-06-01 13:00:04.948',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
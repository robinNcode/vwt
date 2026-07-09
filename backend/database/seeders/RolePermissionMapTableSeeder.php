<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RolePermissionMapTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('role_permission_map')->delete();
        
        \DB::table('role_permission_map')->insert(array (
            0 => 
            array (
                'role_id' => 1,
                'permission_id' => 1,
            ),
            1 => 
            array (
                'role_id' => 1,
                'permission_id' => 2,
            ),
            2 => 
            array (
                'role_id' => 1,
                'permission_id' => 3,
            ),
            3 => 
            array (
                'role_id' => 1,
                'permission_id' => 4,
            ),
            4 => 
            array (
                'role_id' => 1,
                'permission_id' => 5,
            ),
            5 => 
            array (
                'role_id' => 1,
                'permission_id' => 6,
            ),
            6 => 
            array (
                'role_id' => 1,
                'permission_id' => 7,
            ),
            7 => 
            array (
                'role_id' => 1,
                'permission_id' => 8,
            ),
            8 => 
            array (
                'role_id' => 1,
                'permission_id' => 9,
            ),
            9 => 
            array (
                'role_id' => 1,
                'permission_id' => 10,
            ),
            10 => 
            array (
                'role_id' => 1,
                'permission_id' => 11,
            ),
            11 => 
            array (
                'role_id' => 1,
                'permission_id' => 12,
            ),
            12 => 
            array (
                'role_id' => 1,
                'permission_id' => 13,
            ),
            13 => 
            array (
                'role_id' => 1,
                'permission_id' => 14,
            ),
            14 => 
            array (
                'role_id' => 1,
                'permission_id' => 15,
            ),
        ));
        
        
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'role_id' => 1,
                'name' => 'System Admin',
                'email' => 'admin@voltwave.tech',
                'password' => '$2a$10$hY/vIqvhxeCo4YxVl/MaJewUJJ/ikAT7V5qBmTxuOmZVXFXKBiX7i',
                'is_active' => 1,
                'last_login' => NULL,
                'avatar_url' => NULL,
                'created_at' => '2026-06-01 13:00:05.089',
                'updated_at' => '2026-06-01 13:00:05.089',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
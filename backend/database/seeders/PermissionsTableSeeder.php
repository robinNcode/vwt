<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PermissionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('permissions')->delete();
        
        \DB::table('permissions')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'View Products',
                'slug' => 'products.view',
                'module' => 'products',
                'created_at' => '2026-06-01 13:00:04.951',
            ),
            1 => 
            array (
                'id' => 2,
                'name' => 'Manage Products',
                'slug' => 'products.manage',
                'module' => 'products',
                'created_at' => '2026-06-01 13:00:04.955',
            ),
            2 => 
            array (
                'id' => 3,
                'name' => 'View Services',
                'slug' => 'services.view',
                'module' => 'services',
                'created_at' => '2026-06-01 13:00:04.958',
            ),
            3 => 
            array (
                'id' => 4,
                'name' => 'Manage Services',
                'slug' => 'services.manage',
                'module' => 'services',
                'created_at' => '2026-06-01 13:00:04.962',
            ),
            4 => 
            array (
                'id' => 5,
                'name' => 'View Orders',
                'slug' => 'orders.view',
                'module' => 'orders',
                'created_at' => '2026-06-01 13:00:04.965',
            ),
            5 => 
            array (
                'id' => 6,
                'name' => 'Manage Orders',
                'slug' => 'orders.manage',
                'module' => 'orders',
                'created_at' => '2026-06-01 13:00:04.968',
            ),
            6 => 
            array (
                'id' => 7,
                'name' => 'View Quotations',
                'slug' => 'quotations.view',
                'module' => 'quotations',
                'created_at' => '2026-06-01 13:00:04.970',
            ),
            7 => 
            array (
                'id' => 8,
                'name' => 'Manage Quotations',
                'slug' => 'quotations.manage',
                'module' => 'quotations',
                'created_at' => '2026-06-01 13:00:04.973',
            ),
            8 => 
            array (
                'id' => 9,
                'name' => 'View Invoices',
                'slug' => 'invoices.view',
                'module' => 'invoices',
                'created_at' => '2026-06-01 13:00:04.976',
            ),
            9 => 
            array (
                'id' => 10,
                'name' => 'Manage Invoices',
                'slug' => 'invoices.manage',
                'module' => 'invoices',
                'created_at' => '2026-06-01 13:00:04.980',
            ),
            10 => 
            array (
                'id' => 11,
                'name' => 'View Accounting',
                'slug' => 'accounting.view',
                'module' => 'accounting',
                'created_at' => '2026-06-01 13:00:04.984',
            ),
            11 => 
            array (
                'id' => 12,
                'name' => 'Manage Accounting',
                'slug' => 'accounting.manage',
                'module' => 'accounting',
                'created_at' => '2026-06-01 13:00:04.987',
            ),
            12 => 
            array (
                'id' => 13,
                'name' => 'View Reports',
                'slug' => 'reports.view',
                'module' => 'reports',
                'created_at' => '2026-06-01 13:00:04.990',
            ),
            13 => 
            array (
                'id' => 14,
                'name' => 'Manage Settings',
                'slug' => 'settings.manage',
                'module' => 'settings',
                'created_at' => '2026-06-01 13:00:04.992',
            ),
            14 => 
            array (
                'id' => 15,
                'name' => 'Manage Users',
                'slug' => 'users.manage',
                'module' => 'users',
                'created_at' => '2026-06-01 13:00:04.995',
            ),
        ));
        
        
    }
}
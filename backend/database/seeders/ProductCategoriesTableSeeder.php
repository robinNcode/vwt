<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductCategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('product_categories')->delete();
        
        \DB::table('product_categories')->insert(array (
            0 => 
            array (
                'id' => 1,
                'parent_id' => NULL,
                'name_bn' => 'ইন্ডাস্ট্রিয়াল ট্রান্সফরমার',
                'name_en' => 'Industrial Transformers',
                'slug' => 'industrial-transformers',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 0,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.138',
                'updated_at' => '2026-06-01 13:00:05.138',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'parent_id' => NULL,
                'name_bn' => 'পাওয়ার জেনারেটর',
                'name_en' => 'Power Generators',
                'slug' => 'power-generators',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 0,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.141',
                'updated_at' => '2026-06-01 13:00:05.141',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'parent_id' => NULL,
                'name_bn' => 'পিএলসি ও অটোমেশন',
                'name_en' => 'PLC & Automation',
                'slug' => 'plc-automation',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 0,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.143',
                'updated_at' => '2026-06-01 13:00:05.143',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => 4,
                'parent_id' => NULL,
                'name_bn' => 'সোলার প্যানেল',
                'name_en' => 'Solar Panels',
                'slug' => 'solar-panels',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 1,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.197',
                'updated_at' => '2026-06-01 13:00:05.197',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => 5,
                'parent_id' => NULL,
                'name_bn' => 'ইনভার্টার',
                'name_en' => 'Inverters',
                'slug' => 'inverters',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 2,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.200',
                'updated_at' => '2026-06-01 13:00:05.200',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => 6,
                'parent_id' => NULL,
                'name_bn' => 'ব্যাটারি',
                'name_en' => 'Batteries',
                'slug' => 'batteries',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 3,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.203',
                'updated_at' => '2026-06-01 13:00:05.203',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => 7,
                'parent_id' => NULL,
                'name_bn' => 'এক্সেসরিজ',
                'name_en' => 'Accessories',
                'slug' => 'accessories',
                'description_bn' => NULL,
                'description_en' => NULL,
                'image_url' => NULL,
                'sort_order' => 4,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.205',
                'updated_at' => '2026-06-01 13:00:05.205',
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id' => 8,
                'parent_id' => NULL,
                'name_bn' => 'এয়ারট্যাক নিউমেটিক্স',
                'name_en' => 'AirTAC Pneumatics',
                'slug' => 'airtac-pneumatics',
                'description_bn' => NULL,
                'description_en' => 'Current AirTAC pneumatic product families, including valves, preparation units, actuators, fittings and accessories.',
                'image_url' => NULL,
                'sort_order' => 1,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-14 11:54:07.940',
                'updated_at' => '2026-06-14 12:56:49.548',
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id' => 9,
                'parent_id' => NULL,
                'name_bn' => 'বয়লার স্পেয়ার পার্টস',
                'name_en' => 'Boiler Spare Parts',
                'slug' => 'boiler-spare-parts',
                'description_bn' => NULL,
                'description_en' => 'Boiler spare parts and service components aligned with MEL, Hurst, Yuanda and Brox boiler portfolios currently promoted by MEL Group.',
                'image_url' => NULL,
                'sort_order' => 2,
                'is_active' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-14 11:54:07.944',
                'updated_at' => '2026-06-14 12:56:49.553',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
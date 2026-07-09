<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryId = DB::table('product_categories')->insertGetId([
            'name_en' => 'Pneumatic Components',
            'slug' => 'pneumatic-components',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('products')->insert([
            [
                'category_id' => $categoryId,
                'name_en' => 'AirTAC 4V210-08 Solenoid Valve',
                'name_bn' => 'এয়ারট্যাক 4V210-08 সোলেনয়েড ভালভ',
                'slug' => Str::slug('AirTAC 4V210-08 Solenoid Valve'),
                'sku' => 'AT-4V210-08',
                'price' => 1250.00,
                'stock' => 100,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $categoryId,
                'name_en' => 'AirTAC AFR2000 Filter Regulator',
                'name_bn' => 'এয়ারট্যাক AFR2000 ফিল্টার রেগুলেটর',
                'slug' => Str::slug('AirTAC AFR2000 Filter Regulator'),
                'sku' => 'AT-AFR2000',
                'price' => 4100.00,
                'stock' => 30,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}

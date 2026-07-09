<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CurrenciesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('currencies')->delete();
        
        \DB::table('currencies')->insert(array (
            0 => 
            array (
                'id' => 1,
                'code' => 'BDT',
                'symbol' => '৳',
                'name' => 'Bangladeshi Taka',
                'rate' => '1.000000',
                'is_base' => 1,
                'is_active' => 1,
            ),
            1 => 
            array (
                'id' => 2,
                'code' => 'USD',
                'symbol' => '$',
                'name' => 'US Dollar',
                'rate' => '110.000000',
                'is_base' => 0,
                'is_active' => 1,
            ),
            2 => 
            array (
                'id' => 3,
                'code' => 'EUR',
                'symbol' => '€',
                'name' => 'Euro',
                'rate' => '0.008400',
                'is_base' => 0,
                'is_active' => 1,
            ),
        ));
        
        
    }
}
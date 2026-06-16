<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ServicesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('services')->delete();
        
        \DB::table('services')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name_bn' => 'ডিস্ট্রিবিউশন ট্রান্সফরমার কমিশনিং',
                'name_en' => 'Distribution Transformer Commissioning',
                'slug' => 'distribution-transformer-commissioning',
                'description_bn' => '৩০০-১০০০ কেভিএ ট্রান্সফরমার কমিশনিং সেবা।',
                'description_en' => '300-1000 KVA Industrial Transformer configuration and commissioning services.',
                'price' => '45000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 1,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.293',
                'updated_at' => '2026-06-01 13:00:05.293',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'name_bn' => 'পিএলসি অটোমেশন ইন্টিগ্রেশন',
                'name_en' => 'PLC Automation Integration',
                'slug' => 'plc-automation-integration',
                'description_bn' => 'সিমেন্স এবং শ্নাইডার পিএলসি প্যানেল ইন্টিগ্রেশন।',
                'description_en' => 'Complete logic and automation integration for Siemens and Schneider infrastructure.',
                'price' => '75000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 2,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.299',
                'updated_at' => '2026-06-01 13:00:05.299',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
            'name_bn' => 'বার্ষিক রক্ষণাবেক্ষণ (AMC)',
            'name_en' => 'Annual Maintenance Contract (AMC)',
                'slug' => 'annual-maintenance-contract',
                'description_bn' => 'জেনারেটর এবং ক্যাবলিংয়ের সার্বক্ষণিক সার্ভিসিং।',
                'description_en' => '24/7 on-call service and monthly maintenance for major operational generators.',
                'price' => '150000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 3,
                'created_by' => NULL,
                'created_at' => '2026-06-01 13:00:05.302',
                'updated_at' => '2026-06-01 13:00:05.302',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => 4,
                'name_bn' => 'ফুল ফ্যাক্টরি ওয়্যারিং ও প্যানেল সেটআপ',
                'name_en' => 'Full Factory Wiring & Panel Setup',
                'slug' => 'full-factory-wiring-panel-setup',
                'description_bn' => 'কারখানার সম্পূর্ণ পাওয়ার, কন্ট্রোল ও প্যানেল ওয়্যারিং সেবা।',
                'description_en' => 'Complete factory power, control and panel wiring for industrial facilities.',
                'price' => '125000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 3,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.824',
                'updated_at' => '2026-06-14 12:03:37.824',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => 5,
                'name_bn' => 'এসি ইনস্টলেশন ও কমিশনিং',
                'name_en' => 'AC Installation & Commissioning',
                'slug' => 'ac-installation-commissioning',
                'description_bn' => 'কমার্শিয়াল ও ইন্ডাস্ট্রিয়াল এসি সেটআপ, টেস্টিং এবং কমিশনিং।',
                'description_en' => 'Commercial and industrial AC installation, testing and commissioning.',
                'price' => '18000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 4,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.827',
                'updated_at' => '2026-06-14 12:03:37.827',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => 6,
                'name_bn' => 'এসি সার্ভিসিং ও গ্যাস চার্জিং',
                'name_en' => 'AC Servicing & Gas Charging',
                'slug' => 'ac-servicing-gas-charging',
                'description_bn' => 'নিয়মিত এসি পরিষ্কার, গ্যাস চার্জিং এবং কুলিং পারফরম্যান্স অপ্টিমাইজেশন।',
                'description_en' => 'Routine AC cleaning, refrigerant charging and cooling performance optimization.',
                'price' => '8500.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 5,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.832',
                'updated_at' => '2026-06-14 12:03:37.832',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => 7,
                'name_bn' => 'এয়ারট্যাক নিউমেটিক পার্টস ইনস্টলেশন',
                'name_en' => 'AirTAC Pneumatic Parts Installation',
                'slug' => 'airtac-pneumatic-parts-installation',
                'description_bn' => 'সোলেনয়েড ভালভ, সিলিন্ডার, ফিল্টার রেগুলেটর এবং এয়ার লাইন ফিটিং ইনস্টলেশন।',
                'description_en' => 'Installation of solenoid valves, cylinders, filter regulators and air line fittings.',
                'price' => '22000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 6,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.838',
                'updated_at' => '2026-06-14 12:03:37.838',
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id' => 8,
                'name_bn' => 'এয়ার কমপ্রেসার লাইন ও পাইপিং',
                'name_en' => 'Air Compressor Line & Piping',
                'slug' => 'air-compressor-line-piping',
                'description_bn' => 'ফ্যাক্টরি জুড়ে কনপ্রেসড এয়ার পাইপিং, ড্রেন ও ফিল্টার লেআউট।',
                'description_en' => 'Compressed air piping, drain and filter layout across the factory floor.',
                'price' => '32000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 7,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.842',
                'updated_at' => '2026-06-14 12:03:37.842',
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id' => 9,
                'name_bn' => 'হিট সিল মেশিন ইনস্টলেশন',
                'name_en' => 'Heat Seal Machine Installation',
                'slug' => 'heat-seal-machine-installation',
                'description_bn' => 'প্যাকেজিং লাইন, হিট সিলার এবং টেম্পারেচার কন্ট্রোল ইনস্টলেশন।',
                'description_en' => 'Packaging line, heat sealer and temperature control installation.',
                'price' => '28000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 8,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.847',
                'updated_at' => '2026-06-14 12:03:37.847',
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id' => 10,
                'name_bn' => 'প্রিন্টিং মেশিন সেটআপ ও মেইনটেন্যান্স',
                'name_en' => 'Printing Machine Setup & Maintenance',
                'slug' => 'printing-machine-setup-maintenance',
                'description_bn' => 'ইন্ডাস্ট্রিয়াল প্রিন্টার, কোডিং সিস্টেম এবং রেজিস্ট্রেশন সেটআপ।',
                'description_en' => 'Industrial printer, coding system and registration setup with maintenance support.',
                'price' => '35000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 9,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.852',
                'updated_at' => '2026-06-14 12:03:37.852',
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id' => 11,
                'name_bn' => 'বয়লার বার্নার ও সেফটি সার্ভিস',
                'name_en' => 'Boiler Burner & Safety Service',
                'slug' => 'boiler-burner-safety-service',
                'description_bn' => 'বার্নার, ফ্লেম ডিটেক্টর, সেফটি ভালভ এবং লেভেল কন্ট্রোল সার্ভিস।',
                'description_en' => 'Burner, flame detector, safety valve and level control service.',
                'price' => '42000.00',
                'image_url' => NULL,
                'is_active' => 1,
                'sort_order' => 10,
                'created_by' => NULL,
                'created_at' => '2026-06-14 12:03:37.855',
                'updated_at' => '2026-06-14 12:03:37.855',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}
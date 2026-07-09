<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('settings')->delete();
        
        \DB::table('settings')->insert(array (
            0 => 
            array (
                'id' => 1,
                'group' => 'general',
                'key' => 'site_name',
                'value' => 'Volt Wave Tech',
                'value_json' => NULL,
                'label_bn' => 'সাইটের নাম',
                'label_en' => 'Site Name',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.457',
            ),
            1 => 
            array (
                'id' => 2,
                'group' => 'general',
                'key' => 'site_address',
                'value' => 'Kazi Nazrul Islam Ave, Dhaka, Bangladesh',
                'value_json' => NULL,
                'label_bn' => 'সাইটের ঠিকানা',
                'label_en' => 'Site Address',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.463',
            ),
            2 => 
            array (
                'id' => 3,
                'group' => 'general',
                'key' => 'site_email',
                'value' => 'info@voltwave.tech',
                'value_json' => NULL,
                'label_bn' => 'সাইট সাপোর্ট ইমেল',
                'label_en' => 'Site Support Email',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.467',
            ),
            3 => 
            array (
                'id' => 4,
                'group' => 'general',
                'key' => 'site_phone',
                'value' => '+880 1700-000000',
                'value_json' => NULL,
                'label_bn' => 'সাইট ফোন',
                'label_en' => 'Site Phone',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.470',
            ),
            4 => 
            array (
                'id' => 5,
                'group' => 'general',
                'key' => 'footer_text',
                'value' => '© 2024 Volt Wave Tech. All Rights Reserved.',
                'value_json' => NULL,
                'label_bn' => 'ফুটার টেক্সট',
                'label_en' => 'Footer Text',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.473',
            ),
            5 => 
            array (
                'id' => 6,
                'group' => 'social',
                'key' => 'facebook_url',
                'value' => 'https://facebook.com/voltwavetech',
                'value_json' => NULL,
                'label_bn' => 'ফেসবুক ইউআরএল',
                'label_en' => 'Facebook URL',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.476',
            ),
            6 => 
            array (
                'id' => 7,
                'group' => 'social',
                'key' => 'linkedin_url',
                'value' => 'https://linkedin.com/company/voltwave',
                'value_json' => NULL,
                'label_bn' => 'লিঙ্কডইন ইউআরএল',
                'label_en' => 'LinkedIn URL',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.479',
            ),
            7 => 
            array (
                'id' => 8,
                'group' => 'logistics',
                'key' => 'machinery_import_tax',
                'value' => '15.5',
                'value_json' => NULL,
                'label_bn' => 'যন্ত্রপাতি আমদানি ট্যাক্স %',
                'label_en' => 'Machinery Import Tax %',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.482',
            ),
            8 => 
            array (
                'id' => 9,
                'group' => 'logistics',
                'key' => 'default_shipment_method',
                'value' => 'Freight',
                'value_json' => NULL,
                'label_bn' => 'ডিফল্ট শিপমেন্ট মেথড',
                'label_en' => 'Default Shipment Method',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.486',
            ),
            9 => 
            array (
                'id' => 10,
                'group' => 'security',
                'key' => 'enable_mfa',
                'value' => 'false',
                'value_json' => NULL,
                'label_bn' => 'মাল্টি-ফ্যাক্টর অথেন্টিকেশন এনাবল করুন',
                'label_en' => 'Enable Multi-Factor Authentication',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.492',
            ),
            10 => 
            array (
                'id' => 11,
                'group' => 'security',
                'key' => 'session_timeout',
                'value' => '60',
                'value_json' => NULL,
            'label_bn' => 'সেশন টাইমআউট (মিনিট)',
            'label_en' => 'Session Timeout (minutes)',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.497',
            ),
            11 => 
            array (
                'id' => 12,
                'group' => 'notifications',
                'key' => 'email_on_new_order',
                'value' => 'true',
                'value_json' => NULL,
                'label_bn' => 'নতুন অর্ডারে ইমেল নোটিফিকেশন',
                'label_en' => 'Email Notification on New Order',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.501',
            ),
            12 => 
            array (
                'id' => 13,
                'group' => 'notifications',
                'key' => 'sms_on_critical_alert',
                'value' => 'true',
                'value_json' => NULL,
                'label_bn' => 'গুরুতর যন্ত্রপাতি ত্রুটির জন্য এসএমএস সতর্কতা',
                'label_en' => 'SMS Alert for Critical Machinery Errors',
                'updated_by' => NULL,
                'updated_at' => '2026-06-14 12:56:49.504',
            ),
        ));
        
        
    }
}
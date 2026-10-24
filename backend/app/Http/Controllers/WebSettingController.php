<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

/**
 * Controller providing site-wide configuration dictionary backed entirely
 * by the `settings` database table (replacing the former JSON file storage).
 */
class WebSettingController extends Controller
{
    /**
     * Default schema providing fallbacks for all frontend settings.
     */
    protected const DEFAULTS = [
        // General & Contact
        'site_name'        => 'Volt Wave Tech',
        'site_tagline'     => 'Empowering Next-Gen Electrical & Automation Solutions',
        'site_description' => 'Premier provider of high-grade industrial electrical equipment, automation systems, and engineering services.',
        'logo_url'         => '',
        'favicon_url'      => '',
        'footer_text'      => '© 2026 Volt Wave Tech. All rights reserved.',
        'social_links'     => [
            'facebook'  => 'https://facebook.com/voltwavetech',
            'twitter'   => '',
            'instagram' => '',
            'linkedin'  => 'https://linkedin.com/company/voltwave',
            'youtube'   => '',
            'whatsapp'  => '+880170000000',
            'tiktok'    => '',
        ],
        'email'            => 'info@voltwave.tech',
        'phone'            => '+880 1700-000000',
        'phone2'           => '',
        'address'          => 'Kazi Nazrul Islam Ave, Dhaka, Bangladesh',
        'map_url'          => '',

        // SEO
        'meta_title'        => 'Volt Wave Tech | Industrial Electrical & Automation',
        'meta_description'  => 'Industrial automation, electrical engineering, and machinery supplies in Bangladesh.',
        'meta_keywords'     => 'electrical, machinery, engineering, automation, volt wave tech',
        'og_image'          => '',
        'google_analytics'  => '',
        'canonical_url'     => 'https://voltwavebd.com',

        // Invoice / Quotation / Company
        'company_name'          => 'Volt Wave Tech',
        'company_subtitle'      => 'Engineering & Industrial Solutions',
        'company_logo_url'      => '',
        'signature_image_url'   => '',
        'proprietor_name'       => 'Md. Nazmul Huda',
        'proprietor_title'      => 'Managing Director',
        'business_address'      => 'Kazi Nazrul Islam Ave, Dhaka, Bangladesh',
        'business_email'        => 'info@voltwave.tech',
        'business_phone'        => '+880 1700-000000',
        'business_phone2'       => '',
        'bank_name'             => 'City Bank PLC',
        'bank_account_name'     => 'Volt Wave Tech',
        'bank_account_number'   => '1234567890123',
        'bank_routing_number'   => '225272645',
        'invoice_footer_note'   => 'Thank you for your business. For any query, contact accounts@voltwave.tech',

        // Email / SMTP
        'smtp_host'        => 'smtp.gmail.com',
        'smtp_port'        => '587',
        'smtp_user'        => '',
        'smtp_password'    => '',
        'smtp_from_name'   => 'Volt Wave Tech',
        'smtp_from_email'  => 'noreply@voltwave.tech',
        'smtp_encryption'  => 'tls',

        // Theme
        'theme_primary_color'  => '#F5A623',
        'theme_accent_color'   => '#2B3A55',
        'theme_font_family'    => 'Inter',
        'theme_heading_font'   => 'Sora',
        'theme_default_mode'   => 'system',
        'theme_border_radius'  => 'rounded',
        'theme_sidebar_style'  => 'default',

        // Logistics & Operations
        'machinery_import_tax'    => '15.5',
        'default_shipment_method' => 'Freight',
        'currency_code'           => 'BDT',
        'currency_symbol'         => '৳',

        // Security & Alerts
        'enable_mfa'              => 'false',
        'session_timeout'         => '60',
        'email_on_new_order'      => 'true',
        'sms_on_critical_alert'   => 'true',
    ];

    /**
     * Map setting keys to their canonical category group in the database table.
     */
    protected const KEY_TO_GROUP = [
        // General
        'site_name'        => 'general',
        'site_tagline'     => 'general',
        'site_description' => 'general',
        'logo_url'         => 'general',
        'favicon_url'      => 'general',
        'footer_text'      => 'general',
        'email'            => 'general',
        'site_email'       => 'general',
        'phone'            => 'general',
        'site_phone'       => 'general',
        'phone2'           => 'general',
        'address'          => 'general',
        'site_address'     => 'general',
        'map_url'          => 'general',

        // Social
        'social_links'     => 'social',
        'facebook_url'     => 'social',
        'linkedin_url'     => 'social',

        // SEO
        'meta_title'       => 'seo',
        'meta_description' => 'seo',
        'meta_keywords'    => 'seo',
        'og_image'         => 'seo',
        'google_analytics' => 'seo',
        'canonical_url'    => 'seo',

        // Invoice
        'company_name'          => 'invoice',
        'company_subtitle'      => 'invoice',
        'company_logo_url'      => 'invoice',
        'signature_image_url'   => 'invoice',
        'proprietor_name'       => 'invoice',
        'proprietor_title'      => 'invoice',
        'business_address'      => 'invoice',
        'business_email'        => 'invoice',
        'business_phone'        => 'invoice',
        'business_phone2'       => 'invoice',
        'bank_name'             => 'invoice',
        'bank_account_name'     => 'invoice',
        'bank_account_number'   => 'invoice',
        'bank_routing_number'   => 'invoice',
        'invoice_footer_note'   => 'invoice',

        // Email
        'smtp_host'        => 'email',
        'smtp_port'        => 'email',
        'smtp_user'        => 'email',
        'smtp_password'    => 'email',
        'smtp_from_name'   => 'email',
        'smtp_from_email'  => 'email',
        'smtp_encryption'  => 'email',

        // Theme
        'theme_primary_color'  => 'theme',
        'theme_accent_color'   => 'theme',
        'theme_font_family'    => 'theme',
        'theme_heading_font'   => 'theme',
        'theme_default_mode'   => 'theme',
        'theme_border_radius'  => 'theme',
        'theme_sidebar_style'  => 'theme',

        // Logistics
        'machinery_import_tax'    => 'logistics',
        'default_shipment_method' => 'logistics',
        'currency_code'           => 'logistics',
        'currency_symbol'         => 'logistics',

        // Security & Notifications
        'enable_mfa'            => 'security',
        'session_timeout'       => 'security',
        'email_on_new_order'    => 'notifications',
        'sms_on_critical_alert' => 'notifications',
    ];

    /**
     * Build the merged settings dictionary from the database settings table.
     */
    protected function loadSettingsFromDatabase(): array
    {
        $rows = Setting::all();
        $dbData = [];

        foreach ($rows as $row) {
            if ($row->value_json !== null && $row->value_json !== '') {
                $decoded = is_string($row->value_json) ? json_decode($row->value_json, true) : $row->value_json;
                $dbData[$row->key] = $decoded;
            } elseif ($row->value !== null) {
                $dbData[$row->key] = $row->value;
            }
        }

        // Bridge legacy/alternate key names
        if (isset($dbData['site_email']) && !isset($dbData['email'])) {
            $dbData['email'] = $dbData['site_email'];
        }
        if (isset($dbData['site_phone']) && !isset($dbData['phone'])) {
            $dbData['phone'] = $dbData['site_phone'];
        }
        if (isset($dbData['site_address']) && !isset($dbData['address'])) {
            $dbData['address'] = $dbData['site_address'];
        }

        // Build social links
        $social = self::DEFAULTS['social_links'];
        if (isset($dbData['social_links']) && is_array($dbData['social_links'])) {
            $social = array_merge($social, $dbData['social_links']);
        }
        if (isset($dbData['facebook_url']) && !empty($dbData['facebook_url'])) {
            $social['facebook'] = $dbData['facebook_url'];
        }
        if (isset($dbData['linkedin_url']) && !empty($dbData['linkedin_url'])) {
            $social['linkedin'] = $dbData['linkedin_url'];
        }

        $merged = array_merge(self::DEFAULTS, $dbData);
        $merged['social_links'] = $social;

        return $merged;
    }

    /**
     * Return all site settings merged with defaults.
     */
    public function show()
    {
        return ApiResponse::ok('Web settings fetched successfully from database', $this->loadSettingsFromDatabase());
    }

    /**
     * Return settings filtered by group name.
     */
    public function showGroup(string $group)
    {
        $groupKey = strtolower($group);
        $all = $this->loadSettingsFromDatabase();
        $filtered = [];

        foreach (self::KEY_TO_GROUP as $key => $grp) {
            if ($grp === $groupKey && array_key_exists($key, $all)) {
                $filtered[$key] = $all[$key];
            }
        }

        if (empty($filtered)) {
            return ApiResponse::fail("Unknown or empty settings group: {$group}", 404);
        }

        return ApiResponse::ok("Web settings ({$groupKey}) fetched successfully", $filtered);
    }

    /**
     * Update settings into the database `settings` table.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            // General
            'site_name'        => 'nullable|string|max:255',
            'site_tagline'     => 'nullable|string|max:255',
            'site_description' => 'nullable|string|max:1000',
            'logo_url'         => 'nullable|string|max:500',
            'favicon_url'      => 'nullable|string|max:500',
            'footer_text'      => 'nullable|string|max:1000',
            'social_links'           => 'nullable|array',
            'social_links.facebook'  => 'nullable|string|max:500',
            'social_links.twitter'   => 'nullable|string|max:500',
            'social_links.instagram' => 'nullable|string|max:500',
            'social_links.linkedin'  => 'nullable|string|max:500',
            'social_links.youtube'   => 'nullable|string|max:500',
            'social_links.whatsapp'  => 'nullable|string|max:500',
            'social_links.tiktok'    => 'nullable|string|max:500',
            'email'            => 'nullable|string|max:255',
            'phone'            => 'nullable|string|max:50',
            'phone2'           => 'nullable|string|max:50',
            'address'          => 'nullable|string|max:500',
            'map_url'          => 'nullable|string|max:1000',

            // SEO
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords'    => 'nullable|string|max:500',
            'og_image'         => 'nullable|string|max:500',
            'google_analytics' => 'nullable|string|max:255',
            'canonical_url'    => 'nullable|string|max:500',

            // Invoice / Company
            'company_name'        => 'nullable|string|max:255',
            'company_subtitle'    => 'nullable|string|max:255',
            'company_logo_url'    => 'nullable|string|max:500',
            'signature_image_url' => 'nullable|string|max:500',
            'proprietor_name'     => 'nullable|string|max:255',
            'proprietor_title'    => 'nullable|string|max:255',
            'business_address'    => 'nullable|string|max:500',
            'business_email'      => 'nullable|string|max:255',
            'business_phone'      => 'nullable|string|max:50',
            'business_phone2'     => 'nullable|string|max:50',
            'bank_name'           => 'nullable|string|max:255',
            'bank_account_name'   => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_routing_number' => 'nullable|string|max:100',
            'invoice_footer_note' => 'nullable|string|max:1000',

            // Email / SMTP
            'smtp_host'       => 'nullable|string|max:255',
            'smtp_port'       => 'nullable|string|max:10',
            'smtp_user'       => 'nullable|string|max:255',
            'smtp_password'   => 'nullable|string|max:255',
            'smtp_from_name'  => 'nullable|string|max:255',
            'smtp_from_email' => 'nullable|string|max:255',
            'smtp_encryption' => 'nullable|string|max:10',

            // Theme
            'theme_primary_color'  => 'nullable|string|max:50',
            'theme_accent_color'   => 'nullable|string|max:50',
            'theme_font_family'    => 'nullable|string|max:100',
            'theme_heading_font'   => 'nullable|string|max:100',
            'theme_default_mode'   => 'nullable|string|max:20',
            'theme_border_radius'  => 'nullable|string|max:20',
            'theme_sidebar_style'  => 'nullable|string|max:30',

            // Logistics & Ops
            'machinery_import_tax'    => 'nullable|string|max:20',
            'default_shipment_method' => 'nullable|string|max:50',
            'currency_code'           => 'nullable|string|max:10',
            'currency_symbol'         => 'nullable|string|max:10',

            // Security & Notifications
            'enable_mfa'            => 'nullable|string|max:10',
            'session_timeout'       => 'nullable|string|max:10',
            'email_on_new_order'    => 'nullable|string|max:10',
            'sms_on_critical_alert' => 'nullable|string|max:10',
        ]);

        $userId = auth('api')->id();

        foreach ($data as $key => $value) {
            $group = self::KEY_TO_GROUP[$key] ?? 'general';
            $isJson = is_array($value) || is_object($value);

            Setting::updateOrCreate(
                ['group' => $group, 'key' => $key],
                [
                    'value'       => $isJson ? null : ($value !== null ? (string) $value : null),
                    'value_json'  => $isJson ? json_encode($value) : null,
                    'label_en'    => ucwords(str_replace('_', ' ', $key)),
                    'label_bn'    => null,
                    'updated_by'  => $userId,
                ]
            );

            // Sync mirrored keys
            if ($key === 'email') {
                Setting::updateOrCreate(
                    ['group' => 'general', 'key' => 'site_email'],
                    ['value' => $value, 'label_en' => 'Site Support Email', 'updated_by' => $userId]
                );
            } elseif ($key === 'phone') {
                Setting::updateOrCreate(
                    ['group' => 'general', 'key' => 'site_phone'],
                    ['value' => $value, 'label_en' => 'Site Phone', 'updated_by' => $userId]
                );
            } elseif ($key === 'address') {
                Setting::updateOrCreate(
                    ['group' => 'general', 'key' => 'site_address'],
                    ['value' => $value, 'label_en' => 'Site Address', 'updated_by' => $userId]
                );
            } elseif ($key === 'social_links' && is_array($value)) {
                if (!empty($value['facebook'])) {
                    Setting::updateOrCreate(
                        ['group' => 'social', 'key' => 'facebook_url'],
                        ['value' => $value['facebook'], 'label_en' => 'Facebook URL', 'updated_by' => $userId]
                    );
                }
                if (!empty($value['linkedin'])) {
                    Setting::updateOrCreate(
                        ['group' => 'social', 'key' => 'linkedin_url'],
                        ['value' => $value['linkedin'], 'label_en' => 'LinkedIn URL', 'updated_by' => $userId]
                    );
                }
            }
        }

        return ApiResponse::ok('Site configuration saved to database successfully', $this->loadSettingsFromDatabase());
    }
}

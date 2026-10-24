<?php

namespace App\Http\Controllers;

use App\Support\ApiResponse;
use Illuminate\Http\Request;

/**
 * Web settings are stored as a single JSON document on disk, mirroring the Go
 * file-backed WebSettingService (storage/app/web_settings.json).
 */
class WebSettingController extends Controller
{
    /**
     * Comprehensive default values for every web-setting field.
     * Organised to match the frontend WebSettings interface.
     */
    protected const DEFAULTS = [
        // ── General ─────────────────────────────────────────────────
        'site_name'        => 'Volt Wave Tech',
        'site_tagline'     => '',
        'site_description' => '',
        'logo_url'         => '',
        'favicon_url'      => '',
        'footer_text'      => '',
        'social_links'     => [
            'facebook'  => '',
            'twitter'   => '',
            'instagram' => '',
            'linkedin'  => '',
            'youtube'   => '',
            'whatsapp'  => '',
            'tiktok'    => '',
        ],
        'email'            => '',
        'phone'            => '',
        'phone2'           => '',
        'address'          => '',
        'map_url'          => '',

        // ── SEO ─────────────────────────────────────────────────────
        'meta_title'        => '',
        'meta_description'  => '',
        'meta_keywords'     => '',
        'og_image'          => '',
        'google_analytics'  => '',
        'canonical_url'     => '',

        // ── Invoice / Company ───────────────────────────────────────
        'company_name'          => '',
        'company_subtitle'      => '',
        'company_logo_url'      => '',
        'signature_image_url'   => '',
        'proprietor_name'       => '',
        'proprietor_title'      => '',
        'business_address'      => '',
        'business_email'        => '',
        'business_phone'        => '',
        'business_phone2'       => '',
        'bank_name'             => '',
        'bank_account_name'     => '',
        'bank_account_number'   => '',
        'bank_routing_number'   => '',
        'invoice_footer_note'   => '',

        // ── Email / SMTP ────────────────────────────────────────────
        'smtp_host'        => '',
        'smtp_port'        => '',
        'smtp_user'        => '',
        'smtp_password'    => '',
        'smtp_from_name'   => '',
        'smtp_from_email'  => '',
        'smtp_encryption'  => '',

        // ── Theme ───────────────────────────────────────────────────
        'theme_primary_color'  => '',
        'theme_accent_color'   => '',
        'theme_font_family'    => '',
        'theme_heading_font'   => '',
        'theme_default_mode'   => '',
        'theme_border_radius'  => '',
        'theme_sidebar_style'  => '',
    ];

    /**
     * Mapping of group names to the setting keys they contain.
     */
    protected const GROUPS = [
        'general' => [
            'site_name', 'site_tagline', 'site_description', 'logo_url',
            'favicon_url', 'footer_text', 'social_links',
            'email', 'phone', 'phone2', 'address', 'map_url',
        ],
        'seo' => [
            'meta_title', 'meta_description', 'meta_keywords',
            'og_image', 'google_analytics', 'canonical_url',
        ],
        'invoice' => [
            'company_name', 'company_subtitle', 'company_logo_url',
            'signature_image_url', 'proprietor_name', 'proprietor_title',
            'business_address', 'business_email', 'business_phone', 'business_phone2',
            'bank_name', 'bank_account_name', 'bank_account_number',
            'bank_routing_number', 'invoice_footer_note',
        ],
        'email' => [
            'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password',
            'smtp_from_name', 'smtp_from_email', 'smtp_encryption',
        ],
        'theme' => [
            'theme_primary_color', 'theme_accent_color', 'theme_font_family',
            'theme_heading_font', 'theme_default_mode', 'theme_border_radius',
            'theme_sidebar_style',
        ],
    ];

    /**
     * Absolute path of the JSON file backing the web settings.
     */
    protected function filePath(): string
    {
        return storage_path('app/web_settings.json');
    }

    /**
     * Read stored settings and merge them with defaults so every key is present.
     */
    protected function resolvedSettings(): array
    {
        $path = $this->filePath();

        $stored = [];
        if (is_file($path)) {
            $stored = json_decode(file_get_contents($path), true) ?: [];
        }

        // Deep-merge social_links separately so individual sub-keys get defaults.
        $settings = array_merge(self::DEFAULTS, $stored);
        $settings['social_links'] = array_merge(
            self::DEFAULTS['social_links'],
            is_array($settings['social_links'] ?? null) ? $settings['social_links'] : []
        );

        return $settings;
    }

    /**
     * Return the stored web settings, merged with defaults.
     */
    public function show()
    {
        return ApiResponse::ok('Web settings fetched successfully', $this->resolvedSettings());
    }

    /**
     * Return settings filtered by a named group (general, seo, invoice, email, theme).
     */
    public function showGroup(string $group)
    {
        $groupKey = strtolower($group);

        if (! isset(self::GROUPS[$groupKey])) {
            return ApiResponse::fail("Unknown settings group: {$group}", 404);
        }

        $all  = $this->resolvedSettings();
        $keys = self::GROUPS[$groupKey];
        $data = [];

        foreach ($keys as $key) {
            $data[$key] = $all[$key] ?? self::DEFAULTS[$key] ?? null;
        }

        return ApiResponse::ok("Web settings ({$groupKey}) fetched successfully", $data);
    }

    /**
     * Validate and overwrite the web settings JSON file.
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
            'social_links'              => 'nullable|array',
            'social_links.facebook'     => 'nullable|string|max:500',
            'social_links.twitter'      => 'nullable|string|max:500',
            'social_links.instagram'    => 'nullable|string|max:500',
            'social_links.linkedin'     => 'nullable|string|max:500',
            'social_links.youtube'      => 'nullable|string|max:500',
            'social_links.whatsapp'     => 'nullable|string|max:500',
            'social_links.tiktok'       => 'nullable|string|max:500',
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
        ]);

        // Merge incoming data over the current resolved settings so we never lose keys.
        $settings = array_merge($this->resolvedSettings(), $data);

        // Deep-merge social_links
        if (isset($data['social_links']) && is_array($data['social_links'])) {
            $settings['social_links'] = array_merge(
                self::DEFAULTS['social_links'],
                $this->resolvedSettings()['social_links'] ?? [],
                $data['social_links']
            );
        }

        $dir = dirname($this->filePath());
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents(
            $this->filePath(),
            json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        return ApiResponse::ok('Web settings updated successfully', $settings);
    }
}

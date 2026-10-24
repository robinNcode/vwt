<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * List all settings.
     */
    public function index()
    {
        return ApiResponse::ok('Settings fetched successfully', Setting::all());
    }

    /**
     * Return settings filtered by group name.
     */
    public function showByGroup(string $group)
    {
        $settings = Setting::where('group', $group)->get();

        if ($settings->isEmpty()) {
            return ApiResponse::fail("No settings found for group: {$group}", 404);
        }

        return ApiResponse::ok("Settings ({$group}) fetched successfully", $settings);
    }

    /**
     * Create a setting, defaulting its group to "general".
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'group' => 'nullable|string',
            'key' => 'required|string',
            'value' => 'nullable|string',
            'value_json' => 'nullable',
            'label_bn' => 'nullable|string',
            'label_en' => 'nullable|string',
        ]);

        $setting = Setting::create([
            'group' => trim($data['group'] ?? '') !== '' ? trim($data['group']) : 'general',
            'key' => trim($data['key']),
            'value' => $data['value'] ?? null,
            'value_json' => $this->normalizeJson($data['value_json'] ?? null),
            'label_bn' => $data['label_bn'] ?? null,
            'label_en' => $data['label_en'] ?? null,
            'updated_by' => auth('api')->id(),
        ]);

        return ApiResponse::created('Setting created successfully', $setting);
    }

    /**
     * Update a setting, applying only the provided (non-null) fields.
     */
    public function update(Request $request, $id)
    {
        $setting = Setting::find($id);
        if (! $setting) {
            return ApiResponse::fail('Setting not found', 404);
        }

        $data = $request->validate([
            'group' => 'nullable|string',
            'key' => 'nullable|string',
            'value' => 'nullable|string',
            'value_json' => 'nullable',
            'label_bn' => 'nullable|string',
            'label_en' => 'nullable|string',
        ]);

        $setting->fill(array_filter([
            'group' => $data['group'] ?? null,
            'key' => $data['key'] ?? null,
            'value' => $data['value'] ?? null,
            'value_json' => $this->normalizeJson($data['value_json'] ?? null),
            'label_bn' => $data['label_bn'] ?? null,
            'label_en' => $data['label_en'] ?? null,
        ], fn ($v) => $v !== null));
        $setting->updated_by = auth('api')->id();
        $setting->save();

        return ApiResponse::ok('Setting updated successfully', $setting);
    }

    /**
     * Create or update multiple settings in one request.
     */
    public function bulkUpdate(Request $request)
    {
        $items = $request->all();
        if (! is_array($items) || array_is_list($items) === false) {
            // Accept either a bare array or { data: [...] }
            $items = $request->input('settings', $request->input('data', []));
        }

        $userId = auth('api')->id();

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $attributes = [
                'group' => $item['group'] ?? 'general',
                'key' => $item['key'] ?? null,
                'value' => $item['value'] ?? null,
                'value_json' => $this->normalizeJson($item['value_json'] ?? null),
                'label_bn' => $item['label_bn'] ?? null,
                'label_en' => $item['label_en'] ?? null,
                'updated_by' => $userId,
            ];

            if (! empty($item['id'])) {
                Setting::where('id', $item['id'])->update($attributes);
            } elseif (! empty($attributes['key'])) {
                Setting::updateOrCreate(
                    ['group' => $attributes['group'], 'key' => $attributes['key']],
                    $attributes
                );
            }
        }

        return ApiResponse::ok('Settings updated successfully');
    }

    /**
     * Delete a setting.
     */
    public function destroy($id)
    {
        $setting = Setting::find($id);
        if (! $setting) {
            return ApiResponse::fail('Setting not found', 404);
        }
        $setting->delete();

        return ApiResponse::ok('Setting deleted successfully', ['id' => (int) $id]);
    }

    /**
     * value_json is a JSON (text) column; accept either a raw JSON string or an
     * array/object and store it as a JSON string, matching the Go *string field.
     */
    protected function normalizeJson($value): ?string
    {
        if ($value === null) {
            return null;
        }
        if (is_string($value)) {
            return $value;
        }

        return json_encode($value);
    }
}

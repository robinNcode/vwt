"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Setting } from "@/types/setting";

type SettingUpsert = Pick<Setting, "group" | "key" | "value" | "value_json" | "label_bn" | "label_en">;

export default function AdminSettingsPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<SettingUpsert>({
    group: "general",
    key: "",
    value: "",
    value_json: null,
    label_bn: "",
    label_en: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Setting[]>("/settings", { token });
      setItems(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      if (editingId) {
        await apiFetch<Setting>(`/settings/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch<Setting>("/settings", { method: "POST", token, body: JSON.stringify(form) });
      }
      setForm({ group: "general", key: "", value: "", value_json: null, label_bn: "", label_en: "" });
      setEditingId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  function startEdit(s: Setting) {
    setEditingId(s.id);
    setForm({
      group: s.group,
      key: s.key,
      value: s.value ?? "",
      value_json: s.value_json ?? null,
      label_bn: s.label_bn ?? "",
      label_en: s.label_en ?? "",
    });
  }

  async function onDelete(id: number) {
    if (!token) return;
    if (!confirm("Delete this setting?")) return;
    setError(null);
    try {
      await apiFetch<unknown>(`/settings/${id}`, { method: "DELETE", token });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-neutral-600">General configuration + invoice template configuration.</p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[460px_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{isEditing ? "Edit setting" : "New setting"}</h2>
            {isEditing ? (
              <button
                type="button"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    group: "general",
                    key: "",
                    value: "",
                    value_json: null,
                    label_bn: "",
                    label_en: "",
                  });
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Group</span>
              <input
                value={form.group}
                onChange={(e) => setForm((s) => ({ ...s, group: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                placeholder="general"
              />
            </label>

            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Key</span>
              <input
                value={form.key}
                onChange={(e) => setForm((s) => ({ ...s, key: e.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                placeholder="site.title"
              />
            </label>

            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Value</span>
              <input
                value={form.value ?? ""}
                onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                placeholder="Volt Wave Tech"
              />
            </label>

            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Value JSON (optional)
              </span>
              <textarea
                value={form.value_json ?? ""}
                onChange={(e) => setForm((s) => ({ ...s, value_json: e.target.value || null }))}
                className="mt-2 min-h-24 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-mono focus:border-brand-500"
                placeholder='{"primary":"#0F4FF0"}'
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Label (BN)</span>
                <input
                  value={form.label_bn ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, label_bn: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Label (EN)</span>
                <input
                  value={form.label_en ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, label_en: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70"
            disabled={!token}
          >
            {isEditing ? "Save changes" : "Create setting"}
          </button>
        </form>

        <div className="rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <h2 className="text-sm font-semibold">All settings</h2>
            <button
              type="button"
              onClick={() => void load()}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              disabled={loading || !token}
            >
              Refresh
            </button>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-600">
                <tr>
                  <th className="px-4 py-2">Group</th>
                  <th className="px-4 py-2">Key</th>
                  <th className="px-4 py-2">Value</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-neutral-600" colSpan={4}>
                      Loading...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-neutral-600" colSpan={4}>
                      No settings found.
                    </td>
                  </tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="border-t border-neutral-200">
                      <td className="px-4 py-2">{s.group}</td>
                      <td className="px-4 py-2 font-mono text-xs">{s.key}</td>
                      <td className="px-4 py-2">{s.value ?? ""}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          onClick={() => startEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          onClick={() => void onDelete(s.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


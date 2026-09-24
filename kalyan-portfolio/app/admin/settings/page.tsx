"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextArea, TextInput } from "@/components/admin/FormField";
import type { SiteSettings } from "@/lib/types";

const EMPTY = { site_title: "", meta_description: "", accent_color: "" };

export default function SettingsAdminPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(({ data }: { data: SiteSettings | null }) => {
        if (data) setForm({ site_title: data.site_title, meta_description: data.meta_description, accent_color: data.accent_color ?? "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save.");
      setStatus({ type: "success", message: "Site settings saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading settings...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Site Settings" description="SEO metadata and a full JSON backup of your content." />
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <FormField label="Site title" required hint="Used as the browser tab title and social preview title.">
          <TextInput value={form.site_title} onChange={(e) => setForm((f) => ({ ...f, site_title: e.target.value }))} required />
        </FormField>
        <FormField label="Meta description" required hint="Shown in search results and social previews.">
          <TextArea rows={3} value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} required />
        </FormField>
        <FormField label="Accent color (optional)" hint="Hex value, e.g. #5A89FF. Leave blank to use the default.">
          <TextInput value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))} placeholder="#5A89FF" />
        </FormField>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save changes
        </button>
      </form>

      <div className="mt-12 max-w-xl rounded-xl border border-border bg-surface p-6">
        <h3 className="font-medium text-text">Export portfolio data</h3>
        <p className="mt-1.5 text-sm text-muted">
          Download a JSON backup of all your content (images and resume are referenced by URL, not included as files).
        </p>
        <a
          href="/api/export"
          className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-text hover:bg-surface-2"
        >
          <Download size={15} /> Export as JSON
        </a>
      </div>
    </div>
  );
}

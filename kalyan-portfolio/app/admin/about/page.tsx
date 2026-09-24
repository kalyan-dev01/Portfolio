"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextArea, TextInput } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { AboutContent } from "@/lib/types";

const EMPTY: Omit<AboutContent, "id" | "updated_at"> = {
  name: "",
  title: "",
  location: "",
  email: "",
  phone: "",
  avatar_url: null,
  hero_heading: "",
  hero_description: "",
  about_text: "",
  career_goal: "",
};

export default function AboutAdminPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setForm(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save.");
      setForm(json.data);
      setStatus({ type: "success", message: "About section saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading about content...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="About" description="Personal information and hero/about copy shown on the public site." />
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField label="Name" required>
            <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </FormField>
          <FormField label="Title" required hint="Shown as the hero heading.">
            <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </FormField>
          <FormField label="Location" required>
            <TextInput value={form.location} onChange={(e) => set("location", e.target.value)} required />
          </FormField>
          <FormField label="Email" required>
            <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </FormField>
          <FormField label="Phone">
            <TextInput value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </FormField>
        </div>

        <ImageUploader value={form.avatar_url} onChange={(url) => set("avatar_url", url)} folder="avatars" label="Avatar" />

        <FormField label="Hero intro line" required hint='For example: Hi, I&apos;m Kalyan.'>
          <TextInput value={form.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} required />
        </FormField>

        <FormField label="Hero description" required>
          <TextArea rows={3} value={form.hero_description} onChange={(e) => set("hero_description", e.target.value)} required />
        </FormField>

        <FormField label="About text" required>
          <TextArea rows={5} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} required />
        </FormField>

        <FormField label="Career goal">
          <TextArea rows={2} value={form.career_goal ?? ""} onChange={(e) => set("career_goal", e.target.value)} />
        </FormField>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save changes
        </button>
      </form>
    </div>
  );
}

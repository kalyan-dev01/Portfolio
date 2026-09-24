"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextInput } from "@/components/admin/FormField";
import type { SocialLink } from "@/lib/types";

export default function ContactAdminPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    fetch("/api/social-links")
      .then((r) => r.json())
      .then(({ data }) => setLinks(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<SocialLink>) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save.");
      setLinks(json.data);
      setStatus({ type: "success", message: "Contact links saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading contact links...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Contact"
        description="Email and phone live under About. This manages the social/contact links shown across the site."
      />
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        {links.map((link) => (
          <div key={link.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Label">
                <TextInput value={link.label} onChange={(e) => update(link.id, { label: e.target.value })} />
              </FormField>
              <FormField label="URL" hint={link.platform === "email" ? "Use a mailto: link." : undefined}>
                <TextInput value={link.url} onChange={(e) => update(link.id, { url: e.target.value })} />
              </FormField>
            </div>
            <button
              type="button"
              onClick={() => update(link.id, { visible: !link.visible })}
              className="focus-ring mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-text"
            >
              {link.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              {link.visible ? "Visible on site" : "Hidden"}
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save changes
        </button>
      </form>
    </div>
  );
}

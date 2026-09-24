"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextArea, TextInput } from "@/components/admin/FormField";
import type { DsaStats } from "@/lib/types";

const EMPTY = { problems_solved: 0, leetcode_url: "", description: "" };

export default function DsaAdminPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    fetch("/api/dsa")
      .then((r) => r.json())
      .then(({ data }: { data: DsaStats | null }) => {
        if (data) setForm({ problems_solved: data.problems_solved, leetcode_url: data.leetcode_url, description: data.description ?? "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/dsa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save.");
      setStatus({ type: "success", message: "DSA stats saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading DSA stats...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="DSA / LeetCode" description="Powers the animated counter on the public site." />
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <FormField label="Problems solved" required>
          <TextInput
            type="number"
            min={0}
            value={form.problems_solved}
            onChange={(e) => setForm((f) => ({ ...f, problems_solved: Number(e.target.value) }))}
            required
          />
        </FormField>
        <FormField label="LeetCode profile URL" required>
          <TextInput
            type="url"
            value={form.leetcode_url}
            onChange={(e) => setForm((f) => ({ ...f, leetcode_url: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Supporting text">
          <TextArea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </FormField>

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

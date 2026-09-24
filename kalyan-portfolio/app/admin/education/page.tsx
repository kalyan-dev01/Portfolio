"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextArea, TextInput } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Education } from "@/lib/types";

type Draft = Omit<Education, "id">;
const EMPTY: Draft = {
  degree: "",
  field: "",
  institution: "",
  location: "",
  start_date: "",
  end_date: "",
  cgpa: "",
  description: "",
  display_order: 0,
};

export default function EducationAdminPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [newDraft, setNewDraft] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/education")
      .then((r) => r.json())
      .then(({ data }: { data: Education[] }) => {
        setItems(data ?? []);
        const d: Record<string, Draft> = {};
        (data ?? []).forEach((e) => (d[e.id] = e));
        setDrafts(d);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateDraft = (id: string, patch: Partial<Draft>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const saveExisting = async (id: string) => {
    setSavingId(id);
    const res = await fetch(`/api/education/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts[id]),
    });
    const json = await res.json();
    setSavingId(null);
    if (!res.ok) return setStatus({ type: "error", message: json.error || "Failed to save." });
    setItems((prev) => prev.map((e) => (e.id === id ? json.data : e)));
    setStatus({ type: "success", message: "Education entry saved." });
  };

  const createNew = async () => {
    if (!newDraft) return;
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDraft, display_order: items.length }),
    });
    const json = await res.json();
    if (!res.ok) return setStatus({ type: "error", message: json.error || "Failed to add." });
    setItems((prev) => [...prev, json.data]);
    setDrafts((d) => ({ ...d, [json.data.id]: json.data }));
    setNewDraft(null);
    setStatus({ type: "success", message: "Education entry added." });
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((e) => e.id !== id));
      setStatus({ type: "success", message: "Education entry deleted." });
    }
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading education...
      </div>
    );
  }

  const renderForm = (draft: Draft, onChange: (patch: Partial<Draft>) => void) => (
    <div className="grid sm:grid-cols-2 gap-4">
      <FormField label="Degree" required>
        <TextInput value={draft.degree} onChange={(e) => onChange({ degree: e.target.value })} />
      </FormField>
      <FormField label="Field of study">
        <TextInput value={draft.field ?? ""} onChange={(e) => onChange({ field: e.target.value })} />
      </FormField>
      <FormField label="Institution" required>
        <TextInput value={draft.institution} onChange={(e) => onChange({ institution: e.target.value })} />
      </FormField>
      <FormField label="Location">
        <TextInput value={draft.location ?? ""} onChange={(e) => onChange({ location: e.target.value })} />
      </FormField>
      <FormField label="Start date" hint="e.g. 2022-10">
        <TextInput value={draft.start_date ?? ""} onChange={(e) => onChange({ start_date: e.target.value })} />
      </FormField>
      <FormField label="End date" hint="e.g. 2026-04">
        <TextInput value={draft.end_date ?? ""} onChange={(e) => onChange({ end_date: e.target.value })} />
      </FormField>
      <FormField label="CGPA / grade">
        <TextInput value={draft.cgpa ?? ""} onChange={(e) => onChange({ cgpa: e.target.value })} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Description">
          <TextArea rows={2} value={draft.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} />
        </FormField>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Education" description="Add as many entries as you need." />
      <StatusBanner status={status} />

      <div className="space-y-5 max-w-2xl">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-surface p-5">
            {renderForm(drafts[item.id] ?? item, (patch) => updateDraft(item.id, patch))}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => saveExisting(item.id)}
                disabled={savingId === item.id}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
              >
                {savingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
              <button
                onClick={() => setConfirmId(item.id)}
                className="focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {newDraft ? (
          <div className="rounded-xl border border-dashed border-accent/40 bg-surface p-5">
            {renderForm(newDraft, (patch) => setNewDraft((d) => (d ? { ...d, ...patch } : d)))}
            <div className="mt-4 flex gap-3">
              <button onClick={createNew} className="focus-ring rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong">
                Add entry
              </button>
              <button onClick={() => setNewDraft(null)} className="focus-ring rounded-lg border border-border px-4 py-2 text-sm text-muted">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewDraft(EMPTY)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-text hover:bg-surface-2"
          >
            <Plus size={15} /> Add education entry
          </button>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this entry?"
        description="This can't be undone."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </div>
  );
}

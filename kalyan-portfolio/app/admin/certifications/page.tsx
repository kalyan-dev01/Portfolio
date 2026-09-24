"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextInput } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Certification } from "@/lib/types";

type Draft = Omit<Certification, "id">;
const EMPTY: Draft = { name: "", issuer: "", date: "", credential_url: "", image_url: null, display_order: 0 };

export default function CertificationsAdminPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [newDraft, setNewDraft] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/certifications")
      .then((r) => r.json())
      .then(({ data }: { data: Certification[] }) => {
        setItems(data ?? []);
        const d: Record<string, Draft> = {};
        (data ?? []).forEach((c) => (d[c.id] = c));
        setDrafts(d);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateDraft = (id: string, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const saveExisting = async (id: string) => {
    setSavingId(id);
    const res = await fetch(`/api/certifications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts[id]),
    });
    const json = await res.json();
    setSavingId(null);
    if (!res.ok) return setStatus({ type: "error", message: json.error || "Failed to save." });
    setItems((prev) => prev.map((c) => (c.id === id ? json.data : c)));
    setStatus({ type: "success", message: "Certification saved." });
  };

  const createNew = async () => {
    if (!newDraft || !newDraft.name) return;
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDraft, display_order: items.length }),
    });
    const json = await res.json();
    if (!res.ok) return setStatus({ type: "error", message: json.error || "Failed to add." });
    setItems((prev) => [...prev, json.data]);
    setDrafts((d) => ({ ...d, [json.data.id]: json.data }));
    setNewDraft(null);
    setStatus({ type: "success", message: "Certification added." });
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id));
      setStatus({ type: "success", message: "Certification deleted." });
    }
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading certifications...
      </div>
    );
  }

  const renderForm = (draft: Draft, onChange: (patch: Partial<Draft>) => void) => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Name" required>
          <TextInput value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />
        </FormField>
        <FormField label="Issuer">
          <TextInput value={draft.issuer ?? ""} onChange={(e) => onChange({ issuer: e.target.value })} />
        </FormField>
        <FormField label="Date">
          <TextInput value={draft.date ?? ""} onChange={(e) => onChange({ date: e.target.value })} placeholder="e.g. 2024" />
        </FormField>
        <FormField label="Credential URL">
          <TextInput type="url" value={draft.credential_url ?? ""} onChange={(e) => onChange({ credential_url: e.target.value })} />
        </FormField>
      </div>
      <ImageUploader value={draft.image_url} onChange={(url) => onChange({ image_url: url })} folder="certifications" label="Certificate image" />
    </div>
  );

  return (
    <div>
      <PageHeader title="Certifications" description="Optional credential URL and certificate image per entry." />
      <StatusBanner status={status} />

      <div className="space-y-5 max-w-xl">
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
              <button onClick={() => setConfirmId(item.id)} className="focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
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
                Add certification
              </button>
              <button onClick={() => setNewDraft(null)} className="focus-ring rounded-lg border border-border px-4 py-2 text-sm text-muted">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setNewDraft(EMPTY)} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-text hover:bg-surface-2">
            <Plus size={15} /> Add certification
          </button>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this certification?"
        description="This can't be undone."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </div>
  );
}

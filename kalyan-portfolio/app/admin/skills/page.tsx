"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { FormField, TextInput } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Skill } from "@/lib/types";

type Draft = { category: string; name: string; icon: string };
const EMPTY_DRAFT: Draft = { category: "", name: "", icon: "" };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/skills?admin=1")
      .then((r) => r.json())
      .then(({ data }) => setSkills(data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const grouped = categories.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat).sort((a, b) => a.display_order - b.display_order);
    return acc;
  }, {});

  const handleAdd = async () => {
    if (!draft.category || !draft.name) return;
    setStatus(null);
    const maxOrder = Math.max(0, ...skills.filter((s) => s.category === draft.category).map((s) => s.display_order));
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, icon: draft.icon || null, display_order: maxOrder + 1 }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", message: json.error || "Failed to add skill." });
      return;
    }
    setSkills((prev) => [...prev, json.data]);
    setDraft(EMPTY_DRAFT);
    setAdding(false);
    setStatus({ type: "success", message: "Skill added." });
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditDraft({ category: skill.category, name: skill.name, icon: skill.icon ?? "" });
  };

  const saveEdit = async (skill: Skill) => {
    const res = await fetch(`/api/skills/${skill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skill, ...editDraft, icon: editDraft.icon || null }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", message: json.error || "Failed to update skill." });
      return;
    }
    setSkills((prev) => prev.map((s) => (s.id === skill.id ? json.data : s)));
    setEditingId(null);
    setStatus({ type: "success", message: "Skill updated." });
  };

  const toggleVisible = async (skill: Skill) => {
    const res = await fetch(`/api/skills/${skill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skill, visible: !skill.visible }),
    });
    const json = await res.json();
    if (res.ok) setSkills((prev) => prev.map((s) => (s.id === skill.id ? json.data : s)));
  };

  const move = async (skill: Skill, direction: -1 | 1) => {
    const catSkills = grouped[skill.category];
    const idx = catSkills.findIndex((s) => s.id === skill.id);
    const swapWith = catSkills[idx + direction];
    if (!swapWith) return;

    const a = { ...skill, display_order: swapWith.display_order };
    const b = { ...swapWith, display_order: skill.display_order };

    await Promise.all([
      fetch(`/api/skills/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) }),
      fetch(`/api/skills/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }),
    ]);
    setSkills((prev) => prev.map((s) => (s.id === a.id ? a : s.id === b.id ? b : s)));
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setStatus({ type: "success", message: "Skill deleted." });
    } else {
      setStatus({ type: "error", message: "Failed to delete skill." });
    }
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading skills...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Skills" description="Grouped by category. Shown on the public site in this order." />
      <StatusBanner status={status} />

      <div className="mb-8">
        {adding ? (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3 max-w-lg">
            <div className="grid sm:grid-cols-3 gap-3">
              <FormField label="Category" required>
                <TextInput list="categories" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} />
                <datalist id="categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </FormField>
              <FormField label="Skill name" required>
                <TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
              </FormField>
              <FormField label="Icon (optional)">
                <TextInput value={draft.icon} onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))} />
              </FormField>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="focus-ring rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong">
                Add skill
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setDraft(EMPTY_DRAFT);
                }}
                className="focus-ring rounded-lg border border-border px-4 py-2 text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            <Plus size={15} /> Add skill
          </button>
        )}
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted">No skills yet. Add your first one above.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-mono text-sm text-accent mb-3">{category}</h3>
              <ul className="divide-y divide-border">
                {grouped[category].map((skill, idx) => (
                  <li key={skill.id} className="flex items-center gap-3 py-2.5">
                    {editingId === skill.id ? (
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        <TextInput
                          value={editDraft.name}
                          onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                          className="max-w-[180px]"
                        />
                        <TextInput
                          value={editDraft.category}
                          onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                          className="max-w-[140px]"
                        />
                        <button onClick={() => saveEdit(skill)} className="focus-ring rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="focus-ring rounded-lg p-1.5 text-muted">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={"flex-1 text-sm " + (skill.visible ? "text-text" : "text-muted line-through")}>{skill.name}</span>
                        <div className="flex items-center gap-1">
                          <button aria-label="Move up" disabled={idx === 0} onClick={() => move(skill, -1)} className="focus-ring rounded p-1.5 text-muted hover:text-text disabled:opacity-30">
                            <ArrowUp size={14} />
                          </button>
                          <button aria-label="Move down" disabled={idx === grouped[category].length - 1} onClick={() => move(skill, 1)} className="focus-ring rounded p-1.5 text-muted hover:text-text disabled:opacity-30">
                            <ArrowDown size={14} />
                          </button>
                          <button aria-label="Toggle visibility" onClick={() => toggleVisible(skill)} className="focus-ring rounded p-1.5 text-muted hover:text-text">
                            {skill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button aria-label="Edit" onClick={() => startEdit(skill)} className="focus-ring rounded p-1.5 text-muted hover:text-text">
                            <Pencil size={14} />
                          </button>
                          <button aria-label="Delete" onClick={() => setConfirmId(skill.id)} className="focus-ring rounded p-1.5 text-muted hover:text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this skill?"
        description="This can't be undone. The skill will be removed from the public site immediately."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDelete(confirmId)}
      />
    </div>
  );
}

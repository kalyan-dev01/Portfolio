"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/projects?admin=1")
      .then((r) => r.json())
      .then(({ data }) => setProjects((data ?? []).sort((a: Project, b: Project) => a.display_order - b.display_order)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const move = async (project: Project, direction: -1 | 1) => {
    const idx = projects.findIndex((p) => p.id === project.id);
    const swapWith = projects[idx + direction];
    if (!swapWith) return;

    const a = { ...project, display_order: swapWith.display_order };
    const b = { ...swapWith, display_order: project.display_order };

    await Promise.all([
      fetch(`/api/projects/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) }),
      fetch(`/api/projects/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }),
    ]);
    setProjects((prev) =>
      prev.map((p) => (p.id === a.id ? a : p.id === b.id ? b : p)).sort((x, y) => x.display_order - y.display_order)
    );
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setStatus({ type: "success", message: "Project deleted." });
    } else {
      setStatus({ type: "error", message: "Failed to delete project." });
    }
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading projects...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Projects" description="Full CRUD, draft/publish status, featured flag, and manual ordering." />
      <StatusBanner status={status} />

      <Link
        href="/admin/projects/new"
        className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong mb-6"
      >
        <Plus size={15} /> New project
      </Link>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project, idx) => (
            <li key={project.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
              <div className="h-14 w-20 shrink-0 rounded-md border border-border bg-surface-2 overflow-hidden flex items-center justify-center">
                {project.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-[10px] text-muted px-1 text-center">{project.name}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text truncate">{project.name}</p>
                  {project.featured && <Star size={13} className="text-accent shrink-0" fill="currentColor" />}
                </div>
                <p className="text-sm text-muted truncate">{project.short_description}</p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded px-1.5 py-0.5 text-[11px] font-mono",
                    project.published ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  )}
                >
                  {project.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button aria-label="Move up" disabled={idx === 0} onClick={() => move(project, -1)} className="focus-ring rounded p-1.5 text-muted hover:text-text disabled:opacity-30">
                  <ArrowUp size={15} />
                </button>
                <button aria-label="Move down" disabled={idx === projects.length - 1} onClick={() => move(project, 1)} className="focus-ring rounded p-1.5 text-muted hover:text-text disabled:opacity-30">
                  <ArrowDown size={15} />
                </button>
                <Link href={`/admin/projects/${project.id}`} className="focus-ring rounded p-1.5 text-muted hover:text-text">
                  <Pencil size={15} />
                </Link>
                <button aria-label="Delete" onClick={() => setConfirmId(project.id)} className="focus-ring rounded p-1.5 text-muted hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this project?"
        description="This permanently removes the project and its images."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDelete(confirmId)}
      />
    </div>
  );
}

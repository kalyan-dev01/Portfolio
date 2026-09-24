"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import { Checkbox, FormField, TextArea, TextInput } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { slugify } from "@/lib/utils";
import type { Project } from "@/lib/types";

type FormState = Omit<Project, "id" | "created_at" | "updated_at" | "images"> & { images: string[] };

const EMPTY: FormState = {
  slug: "",
  name: "",
  short_description: "",
  detailed_description: "",
  thumbnail_url: null,
  technologies: [],
  features: [],
  github_url: "",
  live_url: "",
  featured: false,
  published: false,
  display_order: 0,
  challenges: "",
  outcomes: "",
  images: [],
};

export default function ProjectEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [techText, setTechText] = useState("");
  const [featureDraft, setFeatureDraft] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/projects/${params.id}`)
      .then((r) => r.json())
      .then(({ data }: { data: Project }) => {
        if (!data) return;
        const { id, created_at, updated_at, images, ...rest } = data;
        setForm({
          ...rest,
          github_url: data.github_url ?? "",
          live_url: data.live_url ?? "",
          detailed_description: data.detailed_description ?? "",
          challenges: data.challenges ?? "",
          outcomes: data.outcomes ?? "",
          images: (images ?? []).map((i) => i.image_url),
        });
        setTechText((data.technologies ?? []).join(", "));
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const addFeature = () => {
    if (!featureDraft.trim()) return;
    set("features", [...form.features, featureDraft.trim()]);
    setFeatureDraft("");
  };
  const removeFeature = (idx: number) => set("features", form.features.filter((_, i) => i !== idx));

  const save = async (publishOverride?: boolean) => {
    setSaving(true);
    setStatus(null);
    const payload = {
      ...form,
      slug: form.slug ? slugify(form.slug) : slugify(form.name),
      technologies: techText.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      published: publishOverride ?? form.published,
    };

    try {
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${params.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save project.");
      setStatus({ type: "success", message: publishOverride ? "Project published." : "Project saved." });
      if (isNew) {
        router.replace(`/admin/projects/${json.data.id}`);
      } else {
        setForm((f) => ({ ...f, published: payload.published }));
      }
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    const res = await fetch(`/api/projects/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/projects");
    } else {
      setStatus({ type: "error", message: "Failed to delete project." });
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading project...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={isNew ? "New project" : "Edit project"} description="Links are optional — leave blank to hide that button on the public site." />
      <StatusBanner status={status} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-8 max-w-2xl"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField label="Project name" required>
            <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </FormField>
          <FormField label="Slug" hint="Used in the project's URL-safe identifier.">
            <TextInput value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name)} />
          </FormField>
        </div>

        <FormField label="Short description" required hint="Shown on the project card.">
          <TextArea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} required />
        </FormField>

        <FormField label="Detailed description" hint="Shown in the project details view.">
          <TextArea rows={4} value={form.detailed_description ?? ""} onChange={(e) => set("detailed_description", e.target.value)} />
        </FormField>

        <ImageUploader value={form.thumbnail_url} onChange={(url) => set("thumbnail_url", url)} folder="projects" label="Thumbnail" />

        <div>
          <span className="block text-sm font-medium text-text mb-1.5">Screenshots (gallery)</span>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative h-20 w-28 rounded-lg border border-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                  className="focus-ring absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                  aria-label="Remove screenshot"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <div className="h-20 w-28">
              <ImageUploader
                value={null}
                onChange={(url) => url && set("images", [...form.images, url])}
                folder="projects"
                label=""
              />
            </div>
          </div>
        </div>

        <FormField label="Technologies" hint="Comma-separated, e.g. React, Node.js, MongoDB">
          <TextInput value={techText} onChange={(e) => setTechText(e.target.value)} />
        </FormField>

        <div>
          <span className="block text-sm font-medium text-text mb-1.5">Features</span>
          <ul className="space-y-1.5 mb-2">
            {form.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text">
                <span className="flex-1">{f}</span>
                <button type="button" onClick={() => removeFeature(i)} className="focus-ring rounded p-1 text-muted hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <TextInput
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              placeholder="Add a feature"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <button type="button" onClick={addFeature} className="focus-ring shrink-0 rounded-lg border border-border px-3 py-2 text-sm text-text hover:bg-surface-2">
              <Plus size={15} />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <FormField label="GitHub URL">
            <TextInput type="url" value={form.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} placeholder="https://github.com/..." />
          </FormField>
          <FormField label="Live URL">
            <TextInput type="url" value={form.live_url ?? ""} onChange={(e) => set("live_url", e.target.value)} placeholder="https://..." />
          </FormField>
        </div>

        <FormField label="Challenges (optional)">
          <TextArea rows={3} value={form.challenges ?? ""} onChange={(e) => set("challenges", e.target.value)} />
        </FormField>
        <FormField label="Outcomes / learnings (optional)">
          <TextArea rows={3} value={form.outcomes ?? ""} onChange={(e) => set("outcomes", e.target.value)} />
        </FormField>

        <div className="flex flex-wrap gap-6">
          <Checkbox checked={form.featured} onChange={(v) => set("featured", v)} label="Featured project" />
          <Checkbox checked={form.published} onChange={(v) => set("published", v)} label="Published" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-text hover:bg-surface-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save draft
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Publish
          </button>
          {!isNew && (
            <a
              href="/#projects"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-text"
            >
              Preview on site
            </a>
          )}
          {!isNew && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="focus-ring ml-auto inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this project?"
        description="This permanently removes the project and its images."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

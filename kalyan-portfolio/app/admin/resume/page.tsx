"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBanner, type Status } from "@/components/admin/StatusBanner";
import type { ResumeInfo } from "@/lib/types";

export default function ResumeAdminPage() {
  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then(({ data }) => setResume(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (file: File) => {
    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resume");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed.");

      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: uploadJson.data.url, file_name: uploadJson.data.fileName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save resume.");
      setResume(json.data);
      setStatus({ type: "success", message: "Resume uploaded successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to upload resume." });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const res = await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_url: null, file_name: null }),
    });
    const json = await res.json();
    if (res.ok) {
      setResume(json.data);
      setStatus({ type: "success", message: "Resume removed." });
    } else {
      setStatus({ type: "error", message: "Failed to remove resume." });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading resume...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Resume" description="Upload a PDF. It's stored in Supabase Storage so it survives redeploys." />
      <StatusBanner status={status} />

      <div className="max-w-md rounded-xl border border-border bg-surface p-6">
        {resume?.file_url ? (
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-surface-2 p-3 text-accent">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{resume.file_name || "resume.pdf"}</p>
              <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="focus-ring text-xs text-accent hover:text-accent-strong">
                View current file
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">No resume uploaded yet.</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {resume?.file_url ? "Replace resume" : "Upload resume"}
          </button>
          {resume?.file_url && (
            <button onClick={handleRemove} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-red-500">
              <Trash2 size={14} /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

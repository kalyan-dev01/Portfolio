"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  accept = "image/png,image/jpeg,image/webp",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      onChange(json.data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="block text-sm font-medium text-text mb-1.5">{label}</span>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 rounded-lg border border-border bg-surface-2 overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload size={18} className="text-muted" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-text hover:bg-surface-2 disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-muted hover:text-red-500"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

import { AlertCircle, CheckCircle2 } from "lucide-react";

export type Status = { type: "success" | "error"; message: string } | null;

export function StatusBanner({ status }: { status: Status }) {
  if (!status) return null;
  const isError = status.type === "error";
  return (
    <div
      role="status"
      className={
        "mb-5 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm " +
        (isError
          ? "border-red-500/30 bg-red-500/10 text-red-500"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500")
      }
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {status.message}
    </div>
  );
}

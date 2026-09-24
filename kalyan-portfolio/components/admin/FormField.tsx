import { ReactNode } from "react";

export function FormField({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text mb-1.5">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-muted mt-1">{hint}</span>}
    </label>
  );
}

const fieldClasses =
  "focus-ring w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted/70";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClasses + " " + (props.className ?? "")} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={fieldClasses + " resize-y " + (props.className ?? "")} />;
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-text cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="focus-ring h-4 w-4 rounded border-border accent-[rgb(var(--accent))]"
      />
      {label}
    </label>
  );
}

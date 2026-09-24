"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/50" onClick={onCancel} />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-xl"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <h3 className="font-medium text-text">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="focus-ring rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="focus-ring rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

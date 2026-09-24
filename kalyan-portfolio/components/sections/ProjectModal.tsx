"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative z-10 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto scrollbar-thin rounded-t-2xl sm:rounded-2xl border border-border bg-surface shadow-xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface/95 backdrop-blur px-5 py-4">
              <h3 id="project-modal-title" className="font-semibold text-text">
                {project.name}
              </h3>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close project details"
                className="focus-ring rounded-lg p-1.5 text-muted hover:text-text hover:bg-surface-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {(project.thumbnail_url || project.images?.length) ? (
                <div className="space-y-3">
                  <img
                    src={project.thumbnail_url || project.images?.[0]?.image_url}
                    alt={`${project.name} screenshot`}
                    className="w-full rounded-lg border border-border object-cover"
                  />
                  {project.images && project.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                      {project.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.image_url}
                          alt=""
                          className="h-16 w-24 flex-shrink-0 rounded-md border border-border object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border font-mono text-sm text-muted">
                  {project.name}
                </div>
              )}

              {project.detailed_description && (
                <p className="text-sm sm:text-base text-muted leading-relaxed">{project.detailed_description}</p>
              )}

              {project.features?.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-accent mb-2">Features</h4>
                  <ul className="space-y-1.5">
                    {project.features.map((feature) => (
                      <li key={feature} className="text-sm text-text/90 pl-4 relative">
                        <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies?.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-accent mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-text/90">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.challenges && (
                <div>
                  <h4 className="font-mono text-xs text-accent mb-2">Challenges</h4>
                  <p className="text-sm text-muted leading-relaxed">{project.challenges}</p>
                </div>
              )}

              {project.outcomes && (
                <div>
                  <h4 className="font-mono text-xs text-accent mb-2">Outcomes</h4>
                  <p className="text-sm text-muted leading-relaxed">{project.outcomes}</p>
                </div>
              )}

              {(project.github_url || project.live_url) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text hover:border-accent hover:text-accent transition-colors"
                    >
                      <Github size={16} /> GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-strong transition-colors"
                    >
                      Live Demo <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

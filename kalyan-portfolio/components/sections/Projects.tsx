"use client";

import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  if (!projects.length) return null;

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-border">
      <div className="container-content">
        <Reveal>
          <SectionLabel>Projects</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text mb-10 max-w-lg">
            A few things I&rsquo;ve built.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Reveal key={project.id}>
              <article
                className={cn(
                  "group h-full flex flex-col rounded-xl border bg-surface overflow-hidden transition-colors",
                  project.featured ? "border-accent/40" : "border-border hover:border-accent/30"
                )}
              >
                <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-surface-2">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={`${project.name} thumbnail`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-sm text-muted">
                      {project.name}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-text">{project.name}</h3>
                    {project.featured && (
                      <span className="font-mono text-[11px] text-accent shrink-0 mt-0.5">Featured</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{project.short_description}</p>

                  {project.technologies?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="rounded border border-border px-2 py-0.5 text-xs text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
                      >
                        <Github size={15} /> Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
                      >
                        Live <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setSelected(project)}
                      className="focus-ring ml-auto inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

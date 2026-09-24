import { Award, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Certification } from "@/lib/types";

export function Certifications({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null;

  return (
    <section id="certifications" className="py-20 md:py-28 border-t border-border">
      <div className="container-content">
        <Reveal>
          <SectionLabel>Certifications</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text mb-10 max-w-lg">
            Courses &amp; certifications.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <Reveal key={cert.id}>
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
                <div className="shrink-0 rounded-lg bg-surface-2 p-2.5 text-accent">
                  <Award size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-text truncate">{cert.name}</h3>
                  {cert.issuer && <p className="mt-0.5 text-sm text-muted">{cert.issuer}</p>}
                  {cert.date && <p className="mt-0.5 text-xs font-mono text-muted">{cert.date}</p>}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring mt-2 inline-flex items-center gap-1 text-sm text-accent hover:text-accent-strong"
                    >
                      View credential <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

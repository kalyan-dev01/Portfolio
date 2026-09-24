import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatDate } from "@/lib/utils";
import type { Education as EducationType } from "@/lib/types";

export function Education({ education }: { education: EducationType[] }) {
  if (!education.length) return null;

  return (
    <section id="education" className="py-20 md:py-28 border-t border-border">
      <div className="container-content grid md:grid-cols-[0.6fr_1fr] gap-10 md:gap-16">
        <Reveal>
          <SectionLabel>Education</SectionLabel>
        </Reveal>

        <div className="space-y-6">
          {education.map((edu) => (
            <Reveal key={edu.id}>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-text">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </h3>
                  {(edu.start_date || edu.end_date) && (
                    <span className="font-mono text-xs text-muted">
                      {formatDate(edu.start_date)} — {formatDate(edu.end_date) || "Present"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ""}
                </p>
                {edu.cgpa && <p className="mt-3 text-sm text-text/90">CGPA: {edu.cgpa}</p>}
                {edu.description && <p className="mt-3 text-sm text-muted leading-relaxed">{edu.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

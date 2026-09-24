import { Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { AboutContent, ResumeInfo } from "@/lib/types";

export function About({ about, resume }: { about: AboutContent; resume: ResumeInfo | null }) {
  return (
    <section id="about" className="py-20 md:py-28 border-t border-border">
      <div className="container-content grid md:grid-cols-[0.6fr_1fr] gap-10 md:gap-16">
        <Reveal>
          <SectionLabel>About</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text max-w-xs">
            Grounded in fundamentals, building toward real products.
          </h2>
        </Reveal>
        <Reveal>
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">{about.about_text}</p>
          {about.career_goal && (
            <p className="mt-5 text-base text-text/90 leading-relaxed max-w-2xl">
              <span className="text-muted">Goal — </span>
              {about.career_goal}
            </p>
          )}
          {resume?.file_url && (
            <a
              href={resume.file_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text hover:border-accent hover:text-accent transition-colors"
            >
              <Download size={16} /> Download Resume
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

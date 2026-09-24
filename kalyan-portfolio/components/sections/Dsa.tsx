import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { DsaStats } from "@/lib/types";

export function Dsa({ dsa }: { dsa: DsaStats }) {
  return (
    <section id="dsa" className="py-20 md:py-28 border-t border-border">
      <div className="container-content">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <SectionLabel>DSA / LeetCode</SectionLabel>
              <p className="text-5xl sm:text-6xl font-semibold tracking-tight text-text font-mono">
                <AnimatedCounter value={dsa.problems_solved} />+
              </p>
              <p className="mt-1 text-sm text-muted">Problems Solved</p>
            </div>

            <div className="max-w-sm sm:border-l sm:border-border sm:pl-8">
              <p className="text-sm sm:text-base text-muted leading-relaxed">{dsa.description}</p>
              <a
                href={dsa.leetcode_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-strong"
              >
                View LeetCode Profile <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

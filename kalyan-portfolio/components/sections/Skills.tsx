import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Skill } from "@/lib/types";

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});
  const categories = Object.keys(grouped);

  if (!categories.length) return null;

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-border">
      <div className="container-content">
        <Reveal>
          <SectionLabel>Skills</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text mb-10 max-w-lg">
            Technologies I work with.
          </h2>
        </Reveal>

        <Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors"
              >
                <h3 className="font-mono text-sm text-accent mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-sm text-text/90"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

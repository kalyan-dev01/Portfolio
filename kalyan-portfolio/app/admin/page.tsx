import Link from "next/link";
import { Award, Code2, FolderKanban, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { getCertifications, getDsaStats, getProjects, getSkills } from "@/lib/queries";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [projects, skills, certifications, dsa] = await Promise.all([
    getProjects(true),
    getSkills(true),
    getCertifications(),
    getDsaStats(),
  ]);

  const cards = [
    {
      label: "Projects",
      value: projects.length,
      sub: `${projects.filter((p) => p.published).length} published`,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    { label: "Skills", value: skills.length, sub: `${skills.filter((s) => s.visible).length} visible`, icon: Sparkles, href: "/admin/skills" },
    { label: "Certifications", value: certifications.length, sub: "total", icon: Award, href: "/admin/certifications" },
    {
      label: "DSA Problems",
      value: dsa?.problems_solved ?? 0,
      sub: "on LeetCode",
      icon: Code2,
      href: "/admin/dsa",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A lightweight, unauthenticated CMS for your personal portfolio. Anyone with this URL can edit content — see the README before sharing it."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="focus-ring rounded-xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-surface-2 p-2 text-accent">
                <Icon size={18} />
              </span>
              <span className="text-2xl font-semibold font-mono text-text">{value}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-text">{label}</p>
            <p className="text-xs text-muted">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

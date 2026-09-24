"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
  Code2,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/dsa", label: "DSA / LeetCode", icon: Code2 },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-2 hover:text-text"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-border bg-surface p-4 min-h-screen sticky top-0">
        <div className="px-2 py-3 mb-2">
          <p className="font-mono text-sm text-text">Portfolio CMS</p>
          <p className="text-xs text-muted mt-0.5">kalyan.dev</p>
        </div>
        {items}
        <div className="mt-auto pt-4">
          <Link
            href="/"
            target="_blank"
            className="focus-ring block rounded-lg border border-border px-3 py-2.5 text-center text-sm text-muted hover:text-text"
          >
            View public site
          </Link>
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <p className="font-mono text-sm text-text">Portfolio CMS</p>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring rounded-lg p-2 text-text"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-b border-border bg-surface p-4">
          {items}
          <Link
            href="/"
            target="_blank"
            className="focus-ring mt-3 block rounded-lg border border-border px-3 py-2.5 text-center text-sm text-muted"
          >
            View public site
          </Link>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "dsa", label: "DSA" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ name }: { name: string }) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const firstName = name.split(" ")[0] || name;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div
        className={cn(
          "container-content flex items-center justify-between rounded-xl transition-all duration-300",
          scrolled && "bg-surface/80 backdrop-blur-md border border-border px-4 py-2 shadow-sm"
        )}
      >
        <a href="#hero" className="font-mono text-sm font-medium text-text focus-ring rounded">
          {firstName}<span className="text-accent">.</span>dev
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "focus-ring rounded px-3 py-1.5 text-sm transition-colors",
                active === item.id ? "text-text" : "text-muted hover:text-text"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="focus-ring rounded-lg p-2 text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button href="#contact" variant="primary" className="!px-4 !py-2">
            Contact Me
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="focus-ring rounded-lg p-2 text-muted hover:text-text"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="focus-ring rounded-lg p-2 text-text"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden container-content mt-2">
          <div className="rounded-xl border border-border bg-surface/95 backdrop-blur-md p-3 flex flex-col gap-1 shadow-sm">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm text-text hover:bg-surface-2"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="focus-ring mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-medium text-white"
            >
              Contact Me
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

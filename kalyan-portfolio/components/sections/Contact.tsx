import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { socialIconFor } from "@/components/ui/SocialIcon";
import type { AboutContent, SocialLink } from "@/lib/types";

export function Contact({ about, socialLinks }: { about: AboutContent; socialLinks: SocialLink[] }) {
  return (
    <section id="contact" className="py-20 md:py-28 border-t border-border">
      <div className="container-content">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-14 text-center">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text max-w-lg mx-auto">
              Let&rsquo;s build something together.
            </h2>
            <p className="mt-4 text-muted max-w-md mx-auto">
              Open to full-stack and AI/GenAI opportunities. Feel free to reach out.
            </p>

            <div className="mt-8 flex justify-center">
              <Button href={`mailto:${about.email}`} variant="primary">
                <Mail size={16} /> Contact Me
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
              <a href={`mailto:${about.email}`} className="focus-ring inline-flex items-center gap-2 rounded hover:text-text">
                <Mail size={15} /> {about.email}
              </a>
              {about.phone && (
                <a href={`tel:${about.phone}`} className="focus-ring inline-flex items-center gap-2 rounded hover:text-text">
                  <Phone size={15} /> {about.phone}
                </a>
              )}
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} /> {about.location}
              </span>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              {socialLinks
                .filter((l) => l.platform !== "email")
                .map((link) => {
                  const Icon = socialIconFor(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="focus-ring rounded-lg p-2 text-muted hover:text-accent"
                    >
                      <Icon size={19} />
                    </a>
                  );
                })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

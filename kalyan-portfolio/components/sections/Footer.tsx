import { socialIconFor } from "@/components/ui/SocialIcon";
import type { AboutContent, SocialLink } from "@/lib/types";

export function Footer({ about, socialLinks }: { about: AboutContent; socialLinks: SocialLink[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10">
      <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-medium text-text">{about.name}</p>
          <p className="text-sm text-muted">{about.title}</p>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = socialIconFor(link.platform);
            return (
              <a
                key={link.id}
                href={link.url}
                target={link.platform === "email" ? undefined : "_blank"}
                rel={link.platform === "email" ? undefined : "noopener noreferrer"}
                aria-label={link.label}
                className="focus-ring rounded-lg p-1.5 text-muted hover:text-text"
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
      <p className="container-content mt-6 text-center sm:text-left text-xs text-muted">
        &copy; {year} {about.name}. All rights reserved.
      </p>
    </footer>
  );
}

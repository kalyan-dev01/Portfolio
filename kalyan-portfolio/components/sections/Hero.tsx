"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { socialIconFor } from "@/components/ui/SocialIcon";
import type { AboutContent, SocialLink } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Hero({ about, socialLinks }: { about: AboutContent; socialLinks: SocialLink[] }) {
  const firstName = about.name.split(" ")[0];

  return (
    <section id="hero" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="container-content grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="font-mono text-accent text-sm mb-4">
            {about.hero_heading}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] tracking-tight text-text max-w-xl"
          >
            {about.title}
          </motion.h1>
          <motion.p variants={item} className="mt-6 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
            {about.hero_description}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#projects" variant="primary">
              View My Work <ArrowRight size={16} />
            </Button>
            <Button href="#contact" variant="secondary">
              Contact Me
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = socialIconFor(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel={link.platform === "email" ? undefined : "noopener noreferrer"}
                  aria-label={link.label}
                  className="focus-ring rounded-lg p-2 text-muted hover:text-accent border border-transparent hover:border-border transition-colors"
                >
                  <Icon size={19} />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
              <span className="ml-2 font-mono text-xs text-muted">profile.ts</span>
            </div>
            <pre className="font-mono text-[13px] leading-6 p-5 overflow-x-auto text-text">
<code>{`const `}<span className="text-accent">{firstName.toLowerCase()}</span>{` = {
  role: `}<span className="text-accent">{`"Full-Stack / AI-GenAI"`}</span>{`,
  based_in: `}<span className="text-accent">{`"Hyderabad, IN"`}</span>{`,
  builds: [
    `}<span className="text-accent">{`"web apps"`}</span>{`,
    `}<span className="text-accent">{`"LLM apps"`}</span>{`,
    `}<span className="text-accent">{`"RAG systems"`}</span>{`,
  ],
  status: `}<span className="text-accent">{`"open to opportunities"`}</span>{`,
};`}</code>
            </pre>
          </div>
          <div className="absolute -z-10 inset-x-8 -bottom-6 h-16 bg-accent/10 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Dsa } from "@/components/sections/Dsa";
import { Education } from "@/components/sections/Education";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getPortfolioData } from "@/lib/queries";

export const revalidate = 0;

export default async function HomePage() {
  const { about, socialLinks, skills, projects, education, certifications, dsa, resume } =
    await getPortfolioData();

  if (!about) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-semibold text-text">Portfolio content not set up yet</h1>
          <p className="mt-3 text-muted text-sm leading-relaxed">
            No profile data was found in Supabase. Run <code className="font-mono text-accent">supabase/schema.sql</code> and{" "}
            <code className="font-mono text-accent">supabase/seed.sql</code>, then visit{" "}
            <code className="font-mono text-accent">/admin</code> to manage your content.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar name={about.name} />
      <main>
        <Hero about={about} socialLinks={socialLinks} />
        <About about={about} resume={resume} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        {dsa && <Dsa dsa={dsa} />}
        <Education education={education} />
        <Certifications certifications={certifications} />
        <Contact about={about} socialLinks={socialLinks} />
      </main>
      <Footer about={about} socialLinks={socialLinks} />
    </>
  );
}

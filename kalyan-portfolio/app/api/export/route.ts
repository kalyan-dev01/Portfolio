import { NextResponse } from "next/server";
import {
  getAbout,
  getCertifications,
  getDsaStats,
  getEducation,
  getProjects,
  getSiteSettings,
  getSkills,
  getSocialLinks,
} from "@/lib/queries";

// Simple JSON backup of all portfolio content (requirement 37).
// Does not include binary image data — only the stored URLs.
export async function GET() {
  const [about, socialLinks, skills, projects, education, certifications, dsa, settings] =
    await Promise.all([
      getAbout(),
      getSocialLinks(),
      getSkills(true),
      getProjects(true),
      getEducation(),
      getCertifications(),
      getDsaStats(),
      getSiteSettings(),
    ]);

  const payload = {
    exported_at: new Date().toISOString(),
    about,
    socialLinks,
    skills,
    projects,
    education,
    certifications,
    dsa,
    settings,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-export-${Date.now()}.json"`,
    },
  });
}

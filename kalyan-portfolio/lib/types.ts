export interface SiteSettings {
  id: string;
  site_title: string;
  meta_description: string;
  accent_color: string | null;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  hero_heading: string;
  hero_description: string;
  about_text: string;
  career_goal: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string; // github | linkedin | leetcode | email | other
  label: string;
  url: string;
  display_order: number;
  visible: boolean;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string | null;
  display_order: number;
  visible: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  detailed_description: string | null;
  thumbnail_url: string | null;
  technologies: string[];
  features: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  challenges: string | null;
  outcomes: string | null;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
}

export interface Education {
  id: string;
  degree: string;
  field: string | null;
  institution: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  cgpa: string | null;
  description: string | null;
  display_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  date: string | null;
  credential_url: string | null;
  image_url: string | null;
  display_order: number;
}

export interface DsaStats {
  id: string;
  problems_solved: number;
  leetcode_url: string;
  description: string | null;
  updated_at: string;
}

export interface ResumeInfo {
  id: string;
  file_url: string | null;
  file_name: string | null;
  updated_at: string;
}

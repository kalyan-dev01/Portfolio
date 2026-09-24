import { Github, Linkedin, Mail, Code2, Link2 } from "lucide-react";

export function socialIconFor(platform: string) {
  switch (platform.toLowerCase()) {
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    case "leetcode":
      return Code2;
    case "email":
      return Mail;
    default:
      return Link2;
  }
}

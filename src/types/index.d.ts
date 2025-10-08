export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  period: string;
  location: string;
  description: string;
  achievements: readonly string[] | string[];
  technologies: readonly string[] | string[];
}

export interface FreelanceProject {
  id: string;
  title: string;
  clients?: readonly string[] | string[];
  description: string;
  achievements: readonly string[] | string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  achievements: readonly string[] | string[];
}

export interface TechStack {
  name: string;
  technologies: readonly string[] | string[];
}

export interface Skill {
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  languages: readonly Skill[] | Skill[];
  frameworks: readonly Skill[] | Skill[];
  tools: readonly Skill[] | Skill[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: readonly string[] | string[];
  features: readonly string[] | string[];
  liveUrl?: string;
  githubUrl?: string;
  clients?: readonly string[] | string[];
  status: "completed" | "in-progress";
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  availableForHire: boolean;
  image: string;
  social: {
    github: string;
    linkedin: string;
  };
}

export interface AboutMe {
  summary: string;
  highlights: string[];
}

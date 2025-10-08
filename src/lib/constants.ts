import {
  Briefcase,
  Code2,
  GraduationCap,
  Home,
  FolderKanban,
  Award,
} from "lucide-react";

export const ROUTES = {
  home: "/",
  experience: "/experience",
  credentials: "/credentials",
  skills: "/skills",
  projects: "/projects",
} as const;

export const PROFILE = {
  name: "Your Name",
  title: "Full Stack Developer",
  location: "Grand Rapids, MI",
  email: "your.email@example.com",
  phone: "(616) 555-0000",
  availableForHire: true,
  image: "/profile.jpg",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
} as const;

export const ABOUT_ME = {
  summary:
    "Passionate Full Stack Developer with 10+ years of experience building scalable web applications, native mobile apps, and AI-powered solutions. Specializing in modern JavaScript frameworks, cloud architecture, and delivering exceptional user experiences.",
  highlights: [
    "10+ years development experience",
    "Expert in React, Next.js, TypeScript",
    "Native mobile app development",
    "Machine learning & AI integration",
    "E-commerce & SaaS solutions",
  ],
} as const;

export const PROFESSIONAL_FOCUS = [
  "Full Stack Web Development",
  "React & Next.js Applications",
  "Cloud Architecture & DevOps",
  "Machine Learning Integration",
  "E-commerce Solutions",
  "Native Mobile Development",
] as const;

export const FAVORITE_TECH_STACKS = [
  {
    name: "Modern Web",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Backend & Cloud",
    technologies: ["Node.js", "Supabase", "PostgreSQL", "AWS"],
  },
  {
    name: "Mobile",
    technologies: ["React Native", "Expo", "Firebase"],
  },
] as const;

export const KEY_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "PostgreSQL",
] as const;

export const NAVIGATION_ITEMS = [
  { name: "Home", href: ROUTES.home, icon: Home },
  { name: "Experience", href: ROUTES.experience, icon: Briefcase },
  { name: "Credentials", href: ROUTES.credentials, icon: GraduationCap },
  { name: "Skills", href: ROUTES.skills, icon: Code2 },
  { name: "Projects", href: ROUTES.projects, icon: FolderKanban },
] as const;

export const EXPERIENCE = [
  {
    id: "ht-hackney",
    company: "HT Hackney",
    role: "Mid-Level Full Stack Engineer",
    duration: "2+ years",
    period: "2022 - Present",
    location: "Remote",
    description:
      "Leading development of enterprise web applications and internal tools serving thousands of users.",
    achievements: [
      "Architected and deployed scalable microservices handling 10M+ requests daily",
      "Reduced application load time by 60% through performance optimization",
      "Mentored junior developers and conducted code reviews",
      "Implemented CI/CD pipelines reducing deployment time by 75%",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
  },
] as const;

export const FREELANCE_PROJECTS = [
  {
    id: "ecommerce-clients",
    title: "E-commerce Solutions",
    clients: ["EMS Outfitters", "Jace Jones MMA Merch"],
    description:
      "Built custom Shopify integrations and marketing websites for multiple e-commerce clients",
    achievements: [
      "Increased conversion rates by 35% through UX improvements",
      "Integrated payment processing and inventory management",
      "Implemented SEO strategies resulting in 200% traffic increase",
    ],
  },
  {
    id: "radiance-by-amy",
    title: "Radiance By Amy",
    description:
      "SEO-optimized marketing website for Michigan's premier makeup artistry service",
    achievements: [
      "Achieved 100/100 Lighthouse performance score",
      "Implemented lead generation system with analytics",
      "Built responsive design with mobile-first approach",
    ],
  },
] as const;

export const EDUCATION = [
  {
    institution: "Davenport University",
    degree: "Bachelor of Science in Computer Science",
    period: "2018 - 2022",
    location: "Grand Rapids, MI",
    achievements: [
      "Dean's List all semesters",
      "Computer Science Club President",
      "Capstone: Machine Learning Stock Prediction System",
    ],
  },
] as const;

export const CERTIFICATIONS = [
  "IBM Full Stack Software Developer Professional Certificate",
  "Advanced React and Redux",
  "Node.js Application Development",
  "Cloud Application Development",
  "Python for Data Science and AI",
  "Machine Learning with Python",
  "Introduction to DevOps",
  "Agile Development and Scrum",
  "Database Design and Management",
  "Container & Kubernetes Essentials",
  "Microservices Architecture",
  "CI/CD Pipeline Implementation",
] as const;

export const SKILLS_EXPERTISE = [
  "SEO Optimization",
  "CMS Integration",
  "API Development",
  "Cloud Architecture",
  "Machine Learning",
  "Wire Framing",
  "Native Mobile Applications",
  "DevOps",
  "Data Analytics",
  "Business Problem Solving",
  "E-commerce Solutions",
  "SaaS Development",
  "UI/UX Design & Research",
] as const;

export const SOFT_SKILLS = [
  "Communication",
  "Team Collaboration",
  "Problem Solving",
  "Project Management",
  "Leadership",
  "Adaptability",
] as const;

export const PROGRAMMING_SKILLS = {
  languages: [
    { name: "TypeScript", proficiency: 95 },
    { name: "JavaScript", proficiency: 95 },
    { name: "Python", proficiency: 85 },
    { name: "SQL", proficiency: 90 },
    { name: "HTML/CSS", proficiency: 95 },
  ],
  frameworks: [
    { name: "React", proficiency: 95 },
    { name: "Next.js", proficiency: 95 },
    { name: "Node.js", proficiency: 90 },
    { name: "Express", proficiency: 85 },
    { name: "React Native", proficiency: 80 },
  ],
  tools: [
    { name: "Git", proficiency: 95 },
    { name: "Docker", proficiency: 85 },
    { name: "AWS", proficiency: 80 },
    { name: "PostgreSQL", proficiency: 90 },
    { name: "MongoDB", proficiency: 80 },
  ],
} as const;

export const PROJECTS = [
  {
    id: "stock-dashboard",
    title: "Stock Trading Dashboard",
    description:
      "Full-stack application for tracking trades and visualizing profit/loss with real-time data integration",
    image: "/projects/stock-dashboard.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "TailwindCSS",
      "Recharts",
    ],
    features: [
      "User authentication and authorization",
      "Real-time stock price updates",
      "Trade tracking and P/L calculations",
      "Interactive charts and analytics",
      "Portfolio performance metrics",
    ],
    liveUrl: "https://stock-dashboard.example.com",
    githubUrl: "https://github.com/yourusername/stock-dashboard",
    status: "completed",
  },
  {
    id: "sharepaws",
    title: "SharePaws - Native Mobile App",
    description:
      "Cross-platform mobile application for a nonprofit organization connecting pet owners and animal shelters",
    image: "/projects/sharepaws.jpg",
    technologies: ["React Native", "Expo", "Firebase", "TypeScript"],
    features: [
      "User profiles and authentication",
      "Pet adoption listings",
      "Community engagement features",
      "Push notifications",
      "Geolocation services",
    ],
    liveUrl: "https://sharepaws.org",
    status: "completed",
  },
  {
    id: "ecommerce-solutions",
    title: "E-commerce Platforms",
    description:
      "Multiple e-commerce solutions integrating with Shopify for various clients",
    image: "/projects/ecommerce.jpg",
    technologies: ["Next.js", "Shopify API", "Stripe", "TailwindCSS"],
    features: [
      "Custom Shopify theme development",
      "Payment processing integration",
      "Inventory management systems",
      "SEO optimization",
      "Analytics and reporting",
    ],
    clients: ["EMS Outfitters", "Jace Jones MMA Merch"],
    status: "completed",
  },
  {
    id: "radiance-by-amy",
    title: "Radiance By Amy",
    description:
      "High-performance marketing website for makeup artistry services with lead generation",
    image: "/projects/radiance.jpg",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    features: [
      "100/100 Lighthouse score",
      "SEO-optimized content",
      "Contact form with email integration",
      "Responsive design",
      "Google Places API integration",
    ],
    liveUrl: "https://radiancebyamy.com",
    githubUrl: "https://github.com/yourusername/radiancebyamy",
    status: "completed",
  },
  {
    id: "ai-solution",
    title: "Custom AI Solution",
    description:
      "AI-powered application demonstrating practical business use cases for machine learning",
    image: "/projects/ai-solution.jpg",
    technologies: ["Python", "TensorFlow", "Next.js", "FastAPI"],
    features: [
      "Machine learning model integration",
      "Real-time predictions",
      "Data visualization dashboard",
      "REST API implementation",
    ],
    status: "in-progress",
  },
  {
    id: "ml-application",
    title: "Machine Learning Application",
    description:
      "Advanced ML application for data analysis and predictive modeling",
    image: "/projects/ml-app.jpg",
    technologies: ["Python", "scikit-learn", "Pandas", "Next.js"],
    features: [
      "Data preprocessing pipeline",
      "Multiple ML algorithms",
      "Model performance comparison",
      "Interactive visualizations",
    ],
    status: "in-progress",
  },
] as const;

export const SITE_CONFIG = {
  name: "Full Stack Developer Portfolio",
  description:
    "Professional portfolio showcasing 10+ years of full-stack development experience, including web applications, mobile apps, and AI solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourportfolio.com",
  ogImage: "/og-image.jpg",
  creator: "Your Name",
  keywords: [
    "full stack developer",
    "React developer",
    "Next.js expert",
    "TypeScript developer",
    "web development",
    "mobile app development",
    "machine learning",
    "AI development",
    "software engineer",
  ],
} as const;

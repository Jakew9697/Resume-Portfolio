export type PortfolioProject = {
  slug: string;
  name: string;
  category: string;
  year: string;
  scope: string[];
  overview: string;
  features: string[];
  technology: string;
  liveUrl?: string;
  images?: { src: string; alt: string; width: number; height: number; caption: string }[];
};

export const projects: PortfolioProject[] = [
  {
    slug: "prospects",
    name: "Prospects",
    category: "Lead management",
    year: "2026",
    scope: ["Product design", "Full-stack development"],
    overview:
      "A map-based lead-management workspace for finding businesses, organizing prospects, and tracking sales follow-up.",
    features: [
      "Explore a live Google Map",
      "Find and save nearby businesses",
      "Track priority and next actions",
      "Export the current prospect list",
    ],
    technology: "Google Maps / Places / React / AWS",
  },
  {
    slug: "helga",
    name: "Helga",
    category: "AI assistant",
    year: "2026",
    scope: ["Interface design", "Voice & AI engineering"],
    overview:
      "A personal assistant workspace that brings tasks, calendar events, drafts, and voice conversations into one considered interface.",
    features: [
      "Talk to the assistant",
      "Create and complete tasks",
      "Plan a calendar event",
      "Generate and review a draft",
    ],
    technology: "Claude / Transcribe / Polly / React",
  },
  {
    slug: "move-v",
    name: "Move V",
    category: "Cross-platform streaming",
    year: "2026",
    scope: ["Product design", "Cross-screen experience"],
    overview:
      "A cinema streaming platform designed across web, phones, tablets, and connected TVs. A shared catalog and playback system support interfaces tailored to browsing by mouse, touch, or remote.",
    features: [
      "Discover films and series in a shared catalog",
      "Browse on desktop, phone, and tablet",
      "Explore interfaces designed for connected TVs",
      "Keep profiles, saved titles, and watch progress together",
    ],
    technology: "Next.js / React Native / Expo / TV interfaces / AWS",
    liveUrl: "https://move-v.app/",
    images: [
      { src: "/projects/move-v-desktop.png", alt: "Move V populated desktop catalog", width: 1440, height: 1000, caption: "Desktop — the populated development catalog" },
      { src: "/projects/move-v-tv.png", alt: "Move V television interface with its film catalog", width: 1920, height: 1080, caption: "TV — webOS / Tizen interface, browser preview" },
      { src: "/projects/move-v-tablet.png", alt: "Move V catalog on a tablet-sized screen", width: 1024, height: 768, caption: "Tablet — responsive web interface" },
      { src: "/projects/move-v-mobile.png", alt: "Move V catalog on a phone-sized screen", width: 390, height: 844, caption: "Phone — responsive web interface" },
    ],
  },
  {
    slug: "receptionist",
    name: "Receptionist",
    category: "Voice AI",
    year: "2026",
    scope: ["Conversation design", "Application development"],
    overview:
      "A receptionist demonstration that turns a conversation into a useful record, preserving the details needed for the next step.",
    features: [
      "Start a visitor conversation",
      "Capture the important details",
      "Review a conversation summary",
      "Return to saved records",
    ],
    technology: "Voice / AI / DynamoDB / AWS",
  },
  {
    slug: "documents",
    name: "Documents",
    category: "Document automation",
    year: "2026",
    scope: ["Workflow design", "Document engineering"],
    overview:
      "A document workspace for turning rough notes into structured, editable content and a finished PDF.",
    features: [
      "Start with a document brief",
      "Generate a structured draft",
      "Edit and save the result",
      "Download a finished PDF",
    ],
    technology: "React / Claude / PDF / AWS",
  },
  {
    slug: "rfp",
    name: "RFP Response Builder",
    category: "Construction proposals",
    year: "2026",
    scope: ["Product design", "AI workflow development"],
    overview:
      "A response builder that helps construction companies quickly produce high-quality responses to requests for proposals, using their own qualifications, project references, and delivery approach.",
    features: [
      "Review the request for proposals",
      "Add company qualifications and project references",
      "Draft and refine the response section by section",
      "Export a polished response as a PDF",
    ],
    technology: "Document parsing / AI / React / AWS",
  },
  {
    slug: "cms",
    name: "Content studio",
    category: "Content publishing",
    year: "2026",
    scope: ["Interface design", "Publishing workflow"],
    overview:
      "A compact content studio that takes an idea through writing, editing, and publishing to a saved page.",
    features: [
      "Create a piece of content",
      "Edit the draft",
      "Save your changes",
      "Publish and open the result",
    ],
    technology: "React / Publishing / DynamoDB / AWS",
  },
];

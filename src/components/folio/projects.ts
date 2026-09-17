export const projects = [
  {
    slug: "prospects",
    name: "Prospects",
    category: "Sales operations",
    year: "2026",
    scope: ["Product design", "Full-stack development"],
    overview:
      "A map-based sales workspace for finding businesses, organizing prospects, and keeping the next conversation in view.",
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
    name: "RFP workspace",
    category: "Research & proposals",
    year: "2026",
    scope: ["Product design", "AI workflow development"],
    overview:
      "A proposal workspace for reviewing requirements, developing a response, and keeping the final document grounded in the supplied material.",
    features: [
      "Review supplied requirements",
      "Build a response outline",
      "Refine the proposal",
      "Export the result as a PDF",
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
export type PortfolioProject = (typeof projects)[number];

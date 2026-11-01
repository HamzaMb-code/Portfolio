export type Project = {
  id: string;
  name: string;
  title: string[];
  featured: boolean;
  tags: string[];
  year: string;
  client: string;
  role: string;
  services: string;
  hue: number;
  intro: string;
  challenge: string;
  approach: string;
  stats: [string, string][];
};

export const profile = {
  name: "Hamza M'barki",
  role: "Full-Stack Web Developer",
  location: "Casablanca, Morocco",
  email: "hamzambarki023@gmail.com",
  domain: "hamzambarki.dev",
  availability: "Open to full-stack roles",
  socials: {
    github: "https://github.com/HamzaMb-code",
    linkedin: "https://www.linkedin.com/in/hamza-mbarki-514926352",
  },
};

export const projects: Project[] = [
  {
    id: "coworking-saas",
    name: "Coworking SaaS",
    title: ["COWORKING", "SAAS"],
    featured: true,
    tags: ["Next.js", "Laravel", "MySQL", "Multi-tenant SaaS"],
    year: "2026",
    client: "Personal project",
    role: "Full-Stack Developer",
    services: "Product design, Front-end, API, Data architecture",
    hue: 158,
    intro:
      "An end-to-end coworking management platform for workspace owners, staff, and customers, bringing resource bookings and manual payment workflows into one place.",
    challenge:
      "Coworking teams coordinate spaces, availability, reservations, and payment records across disconnected workflows. The platform is designed to bring those operations together while keeping each workspace’s data and permissions scoped to its members.",
    approach:
      "The supplied project brief describes a Next.js and TypeScript interface communicating with a Laravel REST API, Laravel Sanctum authentication, and MySQL persistence. Booking prices and availability are validated server-side; bank transfer declarations and reception cash payments are reviewed by authorized workspace staff.",
    stats: [
      ["3", "Workspace roles"],
      ["2", "Manual payment methods"],
      ["1", "Workspace-scoped platform"],
    ],
  },
  {
    id: "bookswap",
    name: "BookSwap",
    title: ["BOOKSWAP"],
    featured: true,
    tags: ["React", "Laravel", "MySQL"],
    year: "2025",
    client: "Personal / academic project",
    role: "Full-Stack Developer (solo)",
    services: "Front-end, Back-end, Database design",
    hue: 205,
    intro:
      "A marketplace where students trade or give away last semester's textbooks instead of letting them gather dust.",
    challenge:
      "Every semester students overpay for books that graduates no longer need. BookSwap needed accounts, book listings and a safe way for two strangers to agree on a handover — designed and built solo, end to end.",
    approach:
      "React on the front end, Laravel and MySQL handling accounts, listings and messaging, with Clerk for authentication so sign-up and listing a book takes minutes, not forms. The data model was mapped in UML before any backend code was written.",
    stats: [
      ["React + Laravel", "Full stack, both ends"],
      ["Clerk", "Auth handled, not hand-rolled"],
      ["1", "Solo build, start to finish"],
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export type ServiceEntry = {
  name: string;
  count: string;
  desc: string;
  chips: string[];
};

export const services: ServiceEntry[] = [
  {
    name: "Front-End Development",
    count: "WEB-01",
    desc: "Interfaces built with React and Next.js, styled with Tailwind and shadcn/ui — from a Figma file or straight from a conversation about what the page needs to do.",
    chips: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "Bootstrap"],
  },
  {
    name: "Back-End & APIs",
    count: "API-02",
    desc: "Server-side logic and data modelling with Laravel and Python, backed by MySQL, MongoDB or Oracle SQL depending on what the project actually needs.",
    chips: ["PHP / Laravel", "Python", "MySQL", "MongoDB", "Oracle SQL"],
  },
  {
    name: "AI-Assisted Workflows",
    count: "AI-03",
    desc: "Building with AI-assisted development tools and the Model Context Protocol as first-class parts of the workflow, not a novelty bolted on afterward.",
    chips: ["AI dev tools", "Model Context Protocol"],
  },
  {
    name: "Agile Delivery",
    count: "PM-04",
    desc: "UML diagrams before code, Git/GitHub for everything, Postman for the API contract — the unglamorous habits that keep a solo or small-team project honest.",
    chips: ["UML", "Agile", "Git / GitHub", "Postman"],
  },
];

export const principles: ServiceEntry[] = [
  {
    name: "Ship the whole stack",
    count: "PR-01",
    desc: "Front end, back end, database — comfortable owning a feature from the schema to the pixel, not just one layer of it.",
    chips: ["Full stack", "End to end"],
  },
  {
    name: "Keep learning the next layer",
    count: "PR-02",
    desc: "Currently deepening Next.js, MongoDB and AI-assisted development workflows — the stack keeps moving, so the learning doesn't stop at graduation.",
    chips: ["Next.js", "MongoDB", "AI tooling"],
  },
  {
    name: "Chase the fix, not the blame",
    count: "PR-03",
    desc: "Team-first by habit — collaboration and finding the actual solution beats being right about whose bug it was.",
    chips: ["Team work", "Collaboration"],
  },
  {
    name: "Autonomous by default",
    count: "PR-04",
    desc: "Comfortable picking up a task and running with it independently, then bringing it back for review rather than waiting to be handed every step.",
    chips: ["Ownership", "Proactive"],
  },
];

export const education = [
  {
    name: "Licence en Génie Informatique",
    detail: "High Tech, Rabat — 2026",
  },
  {
    name: "Technicien Spécialisé — Développement Full Stack",
    detail: "OFPPT — 2023 – 2025",
  },
  {
    name: "Baccalauréat, Sciences Physiques",
    detail: "2022 – 2023",
  },
];

export const dossier = [
  { label: "Based in", value: "Casablanca, Morocco" },
  { label: "Focus", value: "React / Next.js + Laravel" },
  { label: "Status", value: "Recent graduate, 2026" },
  { label: "Currently", value: "Open to full-stack roles" },
  { label: "Languages", value: "Arabic, English, French" },
  { label: "Say hi", value: profile.email },
];

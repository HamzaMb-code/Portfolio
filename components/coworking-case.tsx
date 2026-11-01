import Image from "next/image";
import {
  Armchair,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarCheck,
  CalendarClock,
  Check,
  CircleUserRound,
  CreditCard,
  DoorOpen,
  FileCheck2,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { TransitionLink } from "@/components/page-transition";
import { projects } from "@/lib/content";

const project = projects.find((item) => item.id === "coworking-saas")!;
const backend = ["PHP 8.5", "Laravel 13", "Laravel Sanctum", "REST API", "MySQL"];
const frontend = ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Lucide"];
const imageRoot = "/images/projects/coworking-saas";
const screenshots = [
  {
    file: "coworkingSaas_dashboard.png",
    title: "Owner dashboard",
    description: "A workspace owner’s overview of business activity, resources, and upcoming operations.",
    alt: "Owner dashboard with workspace overview, booking and resource summaries.",
  },
  {
    file: "coworkingSaas_workspaces.png",
    title: "Workspaces & resources",
    description: "Manage workspaces and browse the resources available to customers.",
    alt: "Owner workspace management screen showing available coworking locations and resources.",
  },
  {
    file: "coworkingSaas_bookings.png",
    title: "Booking management",
    description: "Review reservations, customer details, booking statuses, and payment state.",
    alt: "Owner booking management table with reservation, customer, status, and payment columns.",
  },
  {
    file: "coworkingSaas_payments.png",
    title: "Payment management",
    description: "Review payment declarations, methods, verification status, and proof records.",
    alt: "Owner payment management screen showing declarations, payment methods, review status, and proof.",
  },
];

export function generateCoworkingMetadata() {
  return {
    title: "Coworking SaaS",
    description:
      "A multi-tenant coworking management platform for spaces, bookings, workspace teams, and manual payment verification.",
    keywords: ["Coworking SaaS", "Laravel", "Next.js", "Multi-tenant", "Booking management"],
    openGraph: {
      title: "Coworking SaaS — Full-Stack Case Study",
      description: project.intro,
      type: "article",
    },
  };
}

const groups = [
  {
    number: "01",
    title: "Workspace operations",
    icon: Building2,
    description: "Separate workspace settings and membership, with access scoped to the right team.",
    items: ["Workspace activation and suspension", "Membership and role permissions", "Independent workspace settings", "Payment beneficiary details"],
  },
  {
    number: "02",
    title: "Resources & availability",
    icon: Armchair,
    description: "Organize the spaces customers can discover and reserve.",
    items: ["Meeting rooms, offices, and desks", "Capacity and hourly, daily, or monthly rates", "Resource status and availability", "Conflict-aware reservation checks"],
  },
  {
    number: "03",
    title: "Booking lifecycle",
    icon: CalendarCheck,
    description: "Keep every reservation legible from request through its final status.",
    items: ["Server-side price calculation", "Pending through confirmed and completed", "Check-in, check-out, cancellation, and rejection", "Unpaid expiry and no-show processing"],
  },
  {
    number: "04",
    title: "Manual payments",
    icon: ReceiptText,
    description: "Record and verify payments through the real-world methods described in the brief.",
    items: ["Bank transfer declarations and proof", "Staff-reviewed approval or rejection", "Cash recorded at reception", "Verified payment receipts"],
  },
];

const roles = [
  { name: "Workspace owner", icon: Building2, desc: "Manages workspace settings, resources, staff, bookings, payment reviews, and beneficiary information." },
  { name: "Staff", icon: UsersRound, desc: "Supports daily operations, authorized booking tasks, and reception cash recording." },
  { name: "Customer", icon: CircleUserRound, desc: "Browses resources, makes reservations, tracks status, and submits or accesses payment records." },
];

const challenges = [
  ["Tenant boundaries", "Scope workspace data and authorization to the active workspace and its memberships."],
  ["Reservation conflicts", "Validate resource availability and overlapping bookings before confirming a request."],
  ["Trusted totals", "Calculate booking prices on the server using the resource’s configured rate and duration."],
  ["Human payment review", "Keep transfer declarations and cash receipts traceable through explicit staff verification."],
  ["Background lifecycle", "Expire unpaid pending bookings and process no-shows as defined business workflows."],
  ["Private evidence", "Keep uploaded transfer proof in secure private storage with authorized access."],
];

export function CoworkingCase() {
  return (
    <main className="cowork-case">
      <TransitionLink href="/work" className="case__back" data-cursor="ring"><ArrowLeft size={14} /> All work</TransitionLink>
      <section className="cowork-hero">
        <div className="cowork-hero__top"><span className="site-eyebrow">Full-stack SaaS · Case study</span><span>CASE STUDY / 01</span></div>
        <div className="cowork-hero__copy"><p className="cowork-hero__index">PRODUCT / 001</p><h1>Coworking<br /><span>SaaS</span></h1><p className="cowork-hero__intro">A calmer way to run a shared workspace.<br />From first booking to verified payment.</p><a className="cowork-scroll" href="#overview">SCROLL TO EXPLORE <ArrowDown size={14} /></a></div>
        <figure className="cowork-hero__visual">
          <a href={`${imageRoot}/coworkingSaas_heroSection.png`} target="_blank" rel="noreferrer" aria-label="Open the Coworking SaaS homepage screenshot at full size">
            <Image src={`${imageRoot}/coworkingSaas_heroSection.png`} alt="Coworking SaaS public homepage with workspace search and booking calls to action." width={1920} height={1080} sizes="(max-width: 900px) 100vw, 52vw" preload className="cowork-hero__image" />
          </a>
          <figcaption>Public homepage · Coworking SaaS</figcaption>
        </figure>
      </section>

      <section className="cowork-stack" aria-label="Technology stack"><div><small>BACK END</small>{backend.map((tech) => <span key={tech}>{tech}</span>)}</div><div><small>FRONT END</small>{frontend.map((tech) => <span key={tech}>{tech}</span>)}</div></section>

      <section className="cowork-overview" id="overview"><div className="cowork-section-label"><span>01 / OVERVIEW</span><span>THE PRODUCT</span></div><div className="cowork-overview__grid"><h2>One workspace.<br />Every moving part.</h2><div><p className="cowork-lead">Coworking businesses coordinate people, spaces, availability, and payments all day. This platform brings those essential workflows into a single workspace-aware system.</p><p>Owners oversee their space and team. Staff handle day-to-day operations. Customers find and reserve bookable resources, then follow their reservation and payment status from request to receipt.</p><p className="cowork-note"><Building2 size={16} /> Each workspace has its own members, settings, resources, and operational records.</p></div></div></section>

      <section className="cowork-features"><div className="cowork-section-label"><span>02 / CAPABILITIES</span><span>BUILT AROUND THE WORK</span></div><div className="cowork-features__head"><h2>Operational clarity,<br />at every step.</h2><p>Four connected parts of the coworking experience, from workspace setup to payment records.</p></div><div className="cowork-feature-grid">{groups.map(({ number, title, icon: Icon, description, items }) => <article className="cowork-feature" key={number}><div className="cowork-feature__top"><span>{number}</span><Icon size={19} strokeWidth={1.5} /></div><h3>{title}</h3><p>{description}</p><ul>{items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul></article>)}</div></section>

      <section className="cowork-roles"><div className="cowork-section-label"><span>03 / ACCESS MODEL</span><span>THREE ROLES</span></div><div className="cowork-roles__head"><h2>Clear ownership.<br />Purposeful access.</h2><p>Role-based permissions shape what each person can do across workspace operations.</p></div><div className="cowork-role-grid">{roles.map(({ name, icon: Icon, desc }, i) => <article key={name}><span className="cowork-role__number">0{i + 1}</span><Icon size={22} strokeWidth={1.5} /><h3>{name}</h3><p>{desc}</p></article>)}</div></section>

      <section className="cowork-architecture"><div className="cowork-section-label"><span>04 / ARCHITECTURE</span><span>REQUEST TO RECORD</span></div><div className="cowork-architecture__head"><h2>Web experience.<br />API-driven business logic.</h2><p>The Next.js interface calls a Laravel REST API. Sanctum handles authentication, Laravel enforces validation and workspace authorization, and MySQL stores the operational records.</p></div><div className="cowork-flow" aria-label="Architecture diagram"><div><span>01</span><strong>Next.js</strong><small>React · TypeScript<br />Tailwind CSS v4 · shadcn/ui</small></div><ArrowRight /><div><span>02</span><strong>Laravel REST API</strong><small>Sanctum authentication<br />Validation · permissions · rules</small></div><ArrowRight /><div><span>03</span><strong>MySQL</strong><small>Workspace-scoped<br />business records</small></div></div><div className="cowork-architecture__notes"><span><ShieldCheck size={17} /> Workspace-level authorization</span><span><LockKeyhole size={17} /> Private payment evidence</span><span><BadgeCheck size={17} /> Server-validated booking rules</span></div></section>

      <section className="cowork-workflow"><div className="cowork-section-label"><span>05 / WORKFLOW</span><span>BOOKING → PAYMENT → CONFIRMATION</span></div><div className="cowork-workflow__head"><h2>Confirmation is<br />earned, not assumed.</h2><p>Payments use manual verification workflows. Customers declare a transfer or choose reception cash; authorized staff record and review it before the related booking is confirmed.</p></div><div className="cowork-steps"><article><span>01</span><CalendarClock /><h3>Request a resource</h3><p>Check availability and calculate the price server-side.</p></article><i /><article><span>02</span><CreditCard /><h3>Choose how to pay</h3><p>Submit transfer proof or select payment at reception.</p></article><i /><article><span>03</span><FileCheck2 /><h3>Staff verifies</h3><p>Review the declaration or record cash received.</p></article><i /><article><span>04</span><DoorOpen /><h3>Booking confirmed</h3><p>Issue a receipt after successful verification.</p></article></div><div className="cowork-lifecycle"><small>BOOKING STATES</small><span>Pending</span><b>→</b><span>Confirmed</span><b>→</b><span>Checked in</span><b>→</b><span>Checked out</span><b>→</b><span>Completed</span><em>Cancelled · Rejected · No show</em></div><p className="cowork-manual"><Banknote size={16} /> Manual bank transfer and reception cash workflows. No online payment gateway is represented.</p></section>

      <section className="cowork-challenges"><div className="cowork-section-label"><span>06 / ENGINEERING</span><span>DECISIONS & EDGE CASES</span></div><div className="cowork-challenges__head"><h2>Business rules<br />made explicit.</h2><p>Reliable operations depend on handling the states and boundaries behind a simple booking interface.</p></div><div className="cowork-challenge-list">{challenges.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section className="cowork-learning"><div className="cowork-section-label"><span>07 / TAKEAWAYS</span><span>WHAT THIS PROJECT EXPLORES</span></div><div className="cowork-learning__content"><h2>Think beyond<br />the happy path.</h2><div><p>Designing a booking product means connecting interface states to real operational rules: who can see a record, when a reservation is still valid, and what evidence makes a payment verified.</p><p>This project brings together multi-tenant data boundaries, role-based access, API contracts, relational persistence, and responsive product UI in one end-to-end system.</p><div className="cowork-learning__chips"><span>Data modeling</span><span>Authorization</span><span>Business logic</span><span>Product UI</span></div></div></div></section>

      <section className="cowork-gallery" aria-labelledby="cowork-gallery-title">
        <div className="cowork-section-label"><span>08 / OWNER EXPERIENCE</span><span>APPLICATION GALLERY</span></div>
        <div className="cowork-gallery__heading">
          <h2 id="cowork-gallery-title">Application Screenshots</h2>
          <p>Explore the owner interface and the main features of the platform.</p>
        </div>
        <div className="cowork-gallery__grid">
          {screenshots.map((shot) => (
            <article className="cowork-shot" key={shot.file}>
              <a className="cowork-shot__image" href={`${imageRoot}/${shot.file}`} target="_blank" rel="noreferrer" aria-label={`Open ${shot.title} screenshot at full size`}>
                <Image src={`${imageRoot}/${shot.file}`} alt={shot.alt} width={1920} height={1080} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 46vw" loading="lazy" />
              </a>
              <div className="cowork-shot__caption"><div><span>OWNER ACCOUNT</span><h3>{shot.title}</h3></div><p>{shot.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="cowork-links"><div><small>THE PROJECT</small><h2>Built for the<br />details of the day.</h2><p>Source code and the live application are available.</p></div><div className="cowork-links__actions"><a className="cowork-link-disabled" href="https://github.com/HamzaMb-code/Coworking_SaaS" target="_blank" rel="noreferrer">GitHub repository <span>View source ↗</span></a><a className="cowork-link-disabled" href="https://coworking-saa-s.vercel.app/" target="_blank" rel="noreferrer">Live application <span>Open site ↗</span></a><TransitionLink href="/work" className="cowork-back-link">Back to all work <ArrowRight size={16} /></TransitionLink></div></section>
      <footer className="cowork-end"><span>CASE STUDY / COWORKING SAAS</span><span>HAMZA M’BARKI</span></footer>
    </main>
  );
}

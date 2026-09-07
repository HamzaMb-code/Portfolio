import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";
import { PlaceholderArt } from "@/components/placeholder-art";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies in product design, design systems and web design.",
};

export default function WorkIndexPage() {
  return (
    <main className="windex">
      <div className="windex__head site-section">
        <span className="site-eyebrow">Work</span>
        <h1>Every project, in one list.</h1>
      </div>

      <div>
        {projects.map((p, i) => (
          <TransitionLink
            href={`/work/${p.id}`}
            className="wirow"
            key={p.id}
            data-cursor="ring"
          >
            <span className="wirow__idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="wirow__name">{p.name}</span>
            <span className="wirow__cat">{p.tags[0]}</span>
            <span className="wirow__year">{p.year}</span>
            <span className="wirow__thumb">
              <PlaceholderArt hue={p.hue} />
            </span>
          </TransitionLink>
        ))}
      </div>

      <div className="windex__cta">
        <span className="site-eyebrow">Got a project in mind?</span>
        <div style={{ marginTop: 18 }}>
          <TransitionLink href="/about" className="pill-btn" data-cursor="ring">
            Get in touch <b>→</b>
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}

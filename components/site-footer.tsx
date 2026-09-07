"use client";

import { TransitionLink } from "@/components/page-transition";
import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="foot site-section">
      <a
        href={`mailto:${profile.email}`}
        className="foot__cta"
        data-cursor="ring"
      >
        <span className="site-eyebrow">Start a project</span>
        <span className="roll">
          <span className="roll__in">
            <span className="roll__a">Say hello</span>
            <span className="roll__b">{profile.email}</span>
          </span>
        </span>
      </a>

      <div className="foot__meta">
        <div className="grp">
          <small>Navigate</small>
          <TransitionLink href="/" data-cursor="ring">
            Home
          </TransitionLink>
          <TransitionLink href="/work" data-cursor="ring">
            Work
          </TransitionLink>
          <TransitionLink href="/about" data-cursor="ring">
            About
          </TransitionLink>
        </div>
        <div className="grp">
          <small>Elsewhere</small>
          <a href={profile.socials.github} target="_blank" rel="noreferrer" data-cursor="ring">
            GitHub
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" data-cursor="ring">
            LinkedIn
          </a>
        </div>
        <button
          className="toTop"
          data-cursor="ring"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>

      <div className="foot__bar">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
        <span>{profile.availability}</span>
      </div>
    </footer>
  );
}

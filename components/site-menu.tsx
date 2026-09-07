"use client";

import { useUIStore } from "@/lib/store";
import { TransitionLink } from "@/components/page-transition";
import { profile } from "@/lib/content";

const NAV = [
  { n: "01", label: "Home", href: "/" },
  { n: "02", label: "Work", href: "/work" },
  { n: "03", label: "About", href: "/about" },
];

export function SiteMenu() {
  const open = useUIStore((s) => s.menuOpen);
  const setOpen = useUIStore((s) => s.setMenuOpen);

  return (
    <div className={`site-menu ${open ? "-open" : ""}`}>
      <div className="site-menu__inner">
        <div className="site-menu__grid">
          <nav className="site-menu__nav">
            {NAV.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                data-cursor="ring"
                onClick={() => setOpen(false)}
              >
                <small>{item.n}</small>
                <b>{item.label}</b>
              </TransitionLink>
            ))}
          </nav>
          <div className="site-menu__aside">
            <div className="grp">
              <small>Elsewhere</small>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" data-cursor="ring">
                GitHub
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" data-cursor="ring">
                LinkedIn
              </a>
            </div>
            <div className="grp">
              <small>Get in touch</small>
              <a href={`mailto:${profile.email}`} data-cursor="ring">
                {profile.email}
              </a>
            </div>
          </div>
        </div>
        <div className="site-menu__foot">
          <span>{profile.domain}</span>
          <span>{profile.location}</span>
          <span>{profile.availability}</span>
        </div>
      </div>
    </div>
  );
}

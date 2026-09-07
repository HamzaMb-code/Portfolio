"use client";

import { useUIStore } from "@/lib/store";
import { TransitionLink } from "@/components/page-transition";
import { profile } from "@/lib/content";

export function SiteHeader() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  return (
    <header className={`site-head ${menuOpen ? "-onpaper" : ""}`}>
      <TransitionLink
        href="/"
        className="site-head__mark"
        data-cursor="ring"
        onClick={() => setMenuOpen(false)}
      >
        {profile.name.split(" ")[0]}
        <b>.</b>
      </TransitionLink>
      <button
        className={`site-burger ${menuOpen ? "-open" : ""}`}
        data-cursor="ring"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <i />
        <i />
      </button>
    </header>
  );
}

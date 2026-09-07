"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

const SESSION_KEY = "site-loader-shown";

export function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setSkip(true);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setSkip(false);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setPct(100);
      setDone(true);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setPct(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 200);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (skip) return null;

  return (
    <div className={`site-loader ${done ? "-done" : ""}`} aria-hidden={done}>
      <div className="site-loader__mark">
        {profile.name.split(" ")[0]} <b>·</b> {profile.role}
      </div>
      <div className="site-loader__pct">
        {pct}
        <sup>%</sup>
      </div>
      <div className="site-loader__tag site-eyebrow -plain">
        {profile.availability}
      </div>
    </div>
  );
}

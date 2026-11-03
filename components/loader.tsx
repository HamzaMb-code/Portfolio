"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

const SESSION_KEY = "site-loader-shown";

export function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    if (
      sessionStorage.getItem(SESSION_KEY) ||
      document.readyState === "complete"
    ) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    sessionStorage.setItem(SESSION_KEY, "1");
    let loaderShown = false;
    const showTimer = window.setTimeout(() => {
      loaderShown = true;
      if (reduced) {
        setPct(100);
        setDone(true);
      }
      setSkip(false);
    }, 0);

    if (reduced) return () => window.clearTimeout(showTimer);

    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const nextPct = Math.min(95, Math.floor((now - start) / 11));
      setPct(nextPct);
      if (nextPct < 95) {
        raf = requestAnimationFrame(tick);
      }
    }
    function onLoad() {
      cancelAnimationFrame(raf);
      window.clearTimeout(showTimer);
      if (!loaderShown) return;
      setPct(100);
      setDone(true);
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(showTimer);
      window.removeEventListener("load", onLoad);
    };
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

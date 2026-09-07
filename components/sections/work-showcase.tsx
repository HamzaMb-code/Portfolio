"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/page-transition";
import { PlaceholderArt } from "@/components/placeholder-art";
import { useUIStore } from "@/lib/store";
import { featuredProjects, type Project } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

function Tile({ project }: { project: Project }) {
  const setCursor = useUIStore((s) => s.setCursor);
  return (
    <TransitionLink
      href={`/work/${project.id}`}
      className="wfull"
      data-cursor="case"
      data-cursor-label="View case"
      onMouseEnter={() => setCursor("case", "View case")}
      onMouseLeave={() => setCursor("dot")}
    >
      <PlaceholderArt hue={project.hue} className="wfull__art" label={project.year} />
      <div className="wfull__ui">
        <div className="wfull__tags">
          {project.tags.map((t, i) => (
            <span key={t}>
              {i > 0 ? <i>·</i> : null}
              {t}
            </span>
          ))}
        </div>
        <div className="wfull__name">{project.name}</div>
      </div>
    </TransitionLink>
  );
}

export function WorkShowcase() {
  const shellRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const n = featuredProjects.length;
  const reversed = [...featuredProjects].reverse();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const desktop = window.matchMedia("(min-width: 821px)").matches;
    if (reduced || !desktop || !shellRef.current || n < 2) return;

    const ctx = gsap.context(() => {
      const vh = window.innerHeight;
      const total = (n - 1) * vh;
      const st = ScrollTrigger.create({
        trigger: shellRef.current,
        start: "top top",
        end: `+=${total * 1.15}`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(leftRef.current, { y: -p * (n - 1) * vh });
          gsap.set(rightRef.current, { y: -(1 - p) * (n - 1) * vh });
          if (countRef.current) {
            const idx = Math.min(n, Math.round(p * (n - 1)) + 1);
            countRef.current.textContent = String(idx).padStart(2, "0");
          }
        },
      });
      return () => st.kill();
    }, shellRef);

    return () => ctx.revert();
  }, [n]);

  return (
    <section className="work" id="work">
      <div className="work__head site-section">
        <span className="site-eyebrow">Selected work</span>
        <TransitionLink href="/work" className="pill-btn" data-cursor="ring">
          See all work <b>→</b>
        </TransitionLink>
      </div>

      {n >= 2 ? (
        <div ref={shellRef} className="wshow">
          <div className="wcol -l">
            <div ref={leftRef} className="wtrack">
              {featuredProjects.map((p) => (
                <div className="wcell" key={p.id}>
                  <Tile project={p} />
                </div>
              ))}
            </div>
          </div>
          <div className="wcol -r">
            <div ref={rightRef} className="wtrack">
              {reversed.map((p) => (
                <div className="wcell" key={p.id}>
                  <Tile project={p} />
                </div>
              ))}
            </div>
          </div>
          <div className="wshow__count">
            <b ref={countRef}>01</b> / {String(n).padStart(2, "0")}
          </div>
          <div className="wshow__hint">Scroll</div>
        </div>
      ) : (
        <div className="wshow" style={{ height: "90svh" }}>
          <div className="wcol -l" style={{ width: "100%" }}>
            <div className="wtrack">
              {featuredProjects.map((p) => (
                <div className="wcell" key={p.id}>
                  <Tile project={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mslides">
        {featuredProjects.map((p) => (
          <TransitionLink
            href={`/work/${p.id}`}
            className="mslide"
            key={p.id}
            data-cursor="ring"
          >
            <PlaceholderArt hue={p.hue} className="mslide__art" />
            <div className="mslide__ui">
              <div className="mslide__tags">{p.tags.join(" · ")}</div>
              <div className="mslide__name">{p.name}</div>
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}

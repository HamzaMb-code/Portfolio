"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: React.ReactNode;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
};

/** Masks a block and slides it up into view the first time it's scrolled to (or on mount if already visible). */
export function Reveal({
  children,
  as: Tag = "span",
  className,
  delay = 0,
}: RevealProps) {
  const lineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const inner = line.firstElementChild as HTMLElement | null;
    if (inner && delay) inner.style.transitionDelay = `${delay}s`;

    const trigger = ScrollTrigger.create({
      trigger: line,
      start: "top 90%",
      once: true,
      onEnter: () => line.classList.add("-in"),
    });
    return () => trigger.kill();
  }, [delay]);

  const Container = Tag;
  return (
    <Container
      ref={lineRef as unknown as React.Ref<HTMLDivElement>}
      className={`reveal-line ${className ?? ""}`}
    >
      <span>{children}</span>
    </Container>
  );
}

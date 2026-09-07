"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTransitionStore } from "@/lib/store";

function useGrid() {
  const [dims, setDims] = useState({ cols: 10, rows: 6 });
  useEffect(() => {
    function calc() {
      setDims({
        cols: Math.max(8, Math.round(window.innerWidth / 110)),
        rows: Math.max(5, Math.round(window.innerHeight / 110)),
      });
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return dims;
}

export function PixelWipe() {
  const { cols, rows } = useGrid();
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const phase = useTransitionStore((s) => s.phase);
  const pendingHref = useTransitionStore((s) => s.pendingHref);
  const markCovered = useTransitionStore((s) => s.markCovered);
  const finish = useTransitionStore((s) => s.finish);

  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (phase !== "covering" || !gridRef.current) return;
    const cells = gridRef.current.querySelectorAll("i");
    if (reducedRef.current) {
      if (pendingHref) router.push(pendingHref);
      markCovered();
      return;
    }
    gsap.set(cells, { opacity: 0 });
    gsap.to(cells, {
      opacity: 1,
      duration: 0.01,
      stagger: { each: 0.42 / cells.length, from: "random" },
      onComplete: () => {
        if (pendingHref) router.push(pendingHref);
        markCovered();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (phase === "covered" && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;
      const cells = gridRef.current?.querySelectorAll("i");
      const timeout = setTimeout(() => {
        if (!cells || reducedRef.current) {
          finish();
          return;
        }
        gsap.to(cells, {
          opacity: 0,
          duration: 0.01,
          stagger: { each: 0.4 / cells.length, from: "random" },
          onComplete: finish,
        });
      }, 80);
      return () => clearTimeout(timeout);
    }
    lastPathRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, phase]);

  const cellCount = cols * rows;

  return (
    <div
      ref={gridRef}
      className="site-wipe"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-hidden="true"
    >
      {Array.from({ length: cellCount }).map((_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

type TransitionLinkProps = React.ComponentProps<typeof Link>;

export function TransitionLink({
  href,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const pathname = usePathname();
  const cover = useTransitionStore((s) => s.cover);
  const phase = useTransitionStore((s) => s.phase);

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target = typeof href === "string" ? href : href.toString();
        if (target === pathname) return;
        if (phase !== "idle") {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        cover(target);
      }}
      {...rest}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/lib/store";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const mode = useUIStore((s) => s.cursorMode);
  const label = useUIStore((s) => s.cursorLabel);
  const setCursor = useUIStore((s) => s.setCursor);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
    }
    function loop() {
      if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }
    function onOver(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (target) {
        const kind = target.dataset.cursor;
        setCursor(kind === "case" ? "case" : "ring", target.dataset.cursorLabel ?? "");
      } else {
        setCursor("dot");
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [setCursor]);

  return (
    <div
      ref={ref}
      className={`site-cursor ${mode === "ring" ? "-ring" : ""} ${mode === "case" ? "-case" : ""}`}
      aria-hidden="true"
    >
      {mode === "case" && label ? <span>{label}</span> : null}
    </div>
  );
}

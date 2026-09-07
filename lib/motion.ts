export const EASE = "cubic-bezier(0.83, 0, 0.17, 1)";
export const EASE_ARR: [number, number, number, number] = [0.83, 0, 0.17, 1];

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Splits text into per-word spans wrapped in overflow-hidden lines, for mask reveals. */
export function splitLines(text: string): { word: string }[] {
  return text.split(" ").map((word) => ({ word }));
}

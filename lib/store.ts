import { create } from "zustand";

type CursorMode = "dot" | "ring" | "case";

type UIState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  cursorMode: CursorMode;
  cursorLabel: string;
  setCursor: (mode: CursorMode, label?: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),
  cursorMode: "dot",
  cursorLabel: "",
  setCursor: (mode, label = "") => set({ cursorMode: mode, cursorLabel: label }),
}));

type WipePhase = "idle" | "covering" | "covered" | "revealing";

type TransitionState = {
  phase: WipePhase;
  pendingHref: string | null;
  cover: (href: string) => void;
  markCovered: () => void;
  reveal: () => void;
  finish: () => void;
};

export const useTransitionStore = create<TransitionState>((set) => ({
  phase: "idle",
  pendingHref: null,
  cover: (href) => set({ phase: "covering", pendingHref: href }),
  markCovered: () => set({ phase: "covered" }),
  reveal: () => set({ phase: "revealing" }),
  finish: () => set({ phase: "idle", pendingHref: null }),
}));

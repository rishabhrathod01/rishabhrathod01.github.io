"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { flight } from "../store";

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

// Rendered into the hero anchor div via portal; the radial ring is driven
// straight from flight.charge by rAF — no React re-renders.
export default function TakeoffPrompt({
  anchorRef,
  visible,
}: {
  anchorRef: RefObject<HTMLDivElement | null>;
  visible: boolean;
}) {
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const tick = () => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(
          RING_C * (1 - flight.charge)
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!anchorRef.current || !visible) return null;

  return createPortal(
    <div className="absolute inset-x-0 -bottom-12 flex justify-center pointer-events-none select-none">
      <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 font-jetbrains text-xs text-on-surface whitespace-nowrap animate-in fade-in">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2.5"
          />
          <circle
            ref={ringRef}
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            stroke="#c0c1ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C}
            transform="rotate(-90 12 12)"
          />
        </svg>
        <span>
          HOLD{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-surface-container text-primary">
            F
          </kbd>{" "}
          TO TAKE FLIGHT
        </span>
      </div>
    </div>,
    anchorRef.current
  );
}

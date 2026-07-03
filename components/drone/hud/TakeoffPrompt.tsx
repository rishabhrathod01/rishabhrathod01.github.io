"use client";

import { useEffect, useRef } from "react";
import { flight } from "../store";

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;
const CTA_OFFSET_Y = 72;

// Fixed under the viewport-locked drone; position tracks flight.screenX/Y.
export default function TakeoffPrompt({ visible }: { visible: boolean }) {
  const ringRef = useRef<SVGCircleElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const tick = () => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(
          RING_C * (1 - flight.charge)
        );
      }
      const el = wrapRef.current;
      if (el && flight.idleInit) {
        el.style.left = `${flight.screenX}px`;
        el.style.top = `${flight.screenY + CTA_OFFSET_Y}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed z-[61] pointer-events-none select-none"
      style={{
        left: 0,
        top: 0,
        transform: "translate(-50%, 0)",
      }}
    >
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
    </div>
  );
}

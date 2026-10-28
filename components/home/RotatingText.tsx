"use client";

import { useEffect, useState } from "react";

const WIPE_MS = 1800;

// A mask four times the text width: clear | soft ramp | opaque | soft ramp |
// clear, so each end position is fully clear and the middle fully opaque.
// Sliding it left wipes the text in from the left, and sliding it further
// wipes it out, also from the left.
const MASK =
  "linear-gradient(to right, transparent 25%, #000 37.5%, #000 62.5%, transparent 75%)";
const POSITION = { hidden: "100% 0", shown: "50% 0", gone: "0% 0" } as const;
type Phase = keyof typeof POSITION;

// Shows one phrase at a time. The current phrase wipes out left to right, then
// the next one wipes in left to right. Only one phrase is ever in the DOM, so
// they cannot overlap. An optional fixed `prefix` stays put so the line is
// never empty mid-swap. Always one line: on phones the font scales with the viewport so the longest phrase fits.
// Reduced motion keeps the first phrase.
export function RotatingText({
  prefix,
  phrases,
  interval = 6000,
}: {
  prefix?: string;
  phrases: string[];
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("shown");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout>;
    let frame: number;
    const id = setInterval(() => {
      setPhase("gone");
      swap = setTimeout(() => {
        // Jump back to the right without animating, then wipe the new phrase in.
        setPhase("hidden");
        setI((n) => (n + 1) % phrases.length);
        frame = requestAnimationFrame(() =>
          requestAnimationFrame(() => setPhase("shown"))
        );
      }, WIPE_MS);
    }, interval);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
      cancelAnimationFrame(frame);
    };
  }, [phrases.length, interval]);

  return (
    <span className="mt-2 block whitespace-nowrap text-[min(6.5vw,2.25rem)] xl:text-5xl">
      {prefix && <span className="text-gradient">{prefix} </span>}
      <span
        className="text-gradient inline-block"
        style={{
          maskImage: MASK,
          WebkitMaskImage: MASK,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "400% 100%",
          WebkitMaskSize: "400% 100%",
          maskPosition: POSITION[phase],
          WebkitMaskPosition: POSITION[phase],
          transition:
            phase === "hidden"
              ? "none"
              : `mask-position ${WIPE_MS}ms var(--ease), -webkit-mask-position ${WIPE_MS}ms var(--ease)`,
        }}
      >
        {phrases[i]}
      </span>
    </span>
  );
}

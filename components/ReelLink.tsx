"use client";

import { useEffect, useRef, useState } from "react";
import { type Reel, reelUrl } from "@/lib/data";

const W = 300;
const H = 540;

// A link to an Instagram reel. On devices with a mouse, hovering (or focusing)
// it shows the reel in a floating card; the iframe only loads on first hover.
// On touch devices it is a plain link that opens Instagram.
export function ReelLink({
  reel,
  className = "",
  children,
}: {
  reel: Reel;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  const show = () => {
    if (!window.matchMedia("(hover: hover)").matches || !ref.current) return;
    clearTimeout(hide.current);
    const r = ref.current.getBoundingClientRect();
    const left = Math.min(
      Math.max(r.left + r.width / 2 - W / 2, 8),
      window.innerWidth - W - 8
    );
    // Above the link when there is room, otherwise below it.
    // Kept inside the viewport when neither side has full room.
    const top = Math.max(
      8,
      Math.min(
        r.top > H + 16 ? r.top - H - 8 : r.bottom + 8,
        window.innerHeight - H - 8
      )
    );
    setPos({ left, top });
    setLoaded(true);
  };
  // The card is fixed to the viewport, so drop it as soon as the page scrolls.
  useEffect(() => {
    if (!pos) return;
    const drop = () => setPos(null);
    window.addEventListener("scroll", drop, { once: true, passive: true });
    return () => window.removeEventListener("scroll", drop);
  }, [pos]);

  const close = () => {
    hide.current = setTimeout(() => setPos(null), 150);
  };

  return (
    <>
      <a
        ref={ref}
        href={reelUrl(reel)}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={show}
        onMouseLeave={close}
        onFocus={show}
        onBlur={close}
        className={className}
      >
        {children}
      </a>
      {loaded && (
        <span
          role="tooltip"
          onMouseEnter={() => clearTimeout(hide.current)}
          onMouseLeave={close}
          style={{
            left: pos?.left ?? 0,
            top: pos?.top ?? 0,
            width: W,
            height: H,
          }}
          className={`fixed z-50 block overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-[opacity,transform] duration-300 ${
            pos ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0"
          }`}
        >
          {/* Shows through until the reel paints, or if the embed is blocked. */}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-slate-muted">
            Loading reel…
            <a
              href={reelUrl(reel)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-on-surface underline underline-offset-4"
            >
              Open on Instagram
            </a>
          </span>
          <iframe
            src={`${reelUrl(reel)}embed/`}
            title={`Instagram reel: ${reel.place}`}
            width={W}
            height={H}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            className="relative block h-full w-full border-0"
          />
        </span>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";

// A plain string, or a run of words that links somewhere and/or gets its
// own class (e.g. a script font).
type Part = string | { text: string; href?: string; className?: string };

// Words start at 30% and blurred, and light up in reading order as they cross a line
// 40% up from the bottom of the viewport. Plays once.
export function TaglineReveal({
  parts,
  className = "max-w-[680px] text-4xl md:text-5xl",
}: {
  parts: Part[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
    if (!words) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.filter = "none";
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const w = e.target as HTMLElement;
          w.style.opacity = "1";
          w.style.filter = "blur(0px)";
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -40% 0px" }
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  return (
    <p ref={ref} className={`font-bold text-on-surface ${className}`}>
      {parts.map((part, i) => {
        const words = (typeof part === "string" ? part : part.text)
          .split(" ")
          .map((word, j) => (
            <span
              key={j}
              data-word
              className="opacity-30 blur-[3px] transition-[opacity,filter] duration-700"
            >
              {word}{" "}
            </span>
          ));
        if (typeof part === "string") return <Fragment key={i}>{words}</Fragment>;
        if (part.href)
          return (
            <Link
              key={i}
              href={part.href}
              className={`underline decoration-line decoration-2 underline-offset-8 transition-colors hover:decoration-on-surface ${part.className ?? ""}`}
            >
              {words}
            </Link>
          );
        return (
          <span key={i} className={part.className}>
            {words}
          </span>
        );
      })}
    </p>
  );
}

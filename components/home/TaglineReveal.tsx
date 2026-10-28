"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Part = string | { text: string; href: string };

// Words start at 30% and light up in reading order as they cross a line
// 40% up from the bottom of the viewport. Plays once.
export function TaglineReveal({ parts }: { parts: Part[] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = ref.current?.querySelectorAll("span");
    if (!words) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).style.opacity = "1";
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -40% 0px" }
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className="max-w-[680px] text-4xl font-bold text-on-surface md:text-5xl"
    >
      {parts.map((part, i) => {
        const words = (typeof part === "string" ? part : part.text)
          .split(" ")
          .map((word, j) => (
            <span key={j} className="opacity-30 transition-opacity duration-500">
              {word}{" "}
            </span>
          ));
        return typeof part === "string" ? (
          words
        ) : (
          <Link
            key={i}
            href={part.href}
            className="underline decoration-line decoration-2 underline-offset-8 transition-colors hover:decoration-on-surface"
          >
            {words}
          </Link>
        );
      })}
    </p>
  );
}

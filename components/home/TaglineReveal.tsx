"use client";

import { useEffect, useRef } from "react";

// Words start at 30% and light up in reading order as they cross a line
// 40% up from the bottom of the viewport. Plays once.
export function TaglineReveal({ text }: { text: string }) {
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
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="opacity-30 transition-opacity duration-500"
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

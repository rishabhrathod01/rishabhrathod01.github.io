"use client";

import { motion, MotionConfig } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Rise, fade, and sharpen from a blur once when scrolled into view.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          // A lingering filter makes a stacking context; drop it when done.
          transitionEnd: { filter: "none" },
        }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

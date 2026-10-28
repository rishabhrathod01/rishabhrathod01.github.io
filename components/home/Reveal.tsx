"use client";

import { motion, MotionConfig } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Rise 32px and fade in once when scrolled into view.
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
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7, ease, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

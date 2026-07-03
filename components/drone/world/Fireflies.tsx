"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "@react-three/drei";
import { P } from "@/lib/drone/palette";
import { POND } from "@/lib/drone/layout";
import { flight } from "../store";

// Fireflies come out as the day leans toward sunset — they'd look wrong in
// the morning light. Cheap 1 Hz poll of the day cycle.
export default function Fireflies() {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => setOut(flight.dayT > 0.5), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!out) return null;
  return (
    <>
      <Sparkles
        count={110}
        scale={[130, 8, 130]}
        position={[0, 4, 0]}
        size={2.5}
        speed={0.25}
        color={P.emerald}
        opacity={0.7}
      />
      <Sparkles
        count={40}
        scale={[24, 4, 24]}
        position={[POND.x, 1.5, POND.z]}
        size={3}
        speed={0.35}
        color={P.lavender}
        opacity={0.65}
      />
    </>
  );
}

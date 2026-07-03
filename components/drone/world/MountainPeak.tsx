"use client";

import { useMemo } from "react";
import { Sparkles } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import { MOUNTAIN } from "@/lib/drone/layout";
import { P } from "@/lib/drone/palette";

// Mandalpatti Peak — a slender green spire that pierces well above the
// flight ceiling, so it genuinely reads as "above the clouds". Low-poly
// stacked cones, each tier sunk into the one below to hide the seam where a
// cone's point meets the next tier's wider base.
const TIERS = [
  { r: 7, h: 15, color: P.canopy },
  { r: 5, h: 11, color: P.grassTip },
  { r: 3.2, h: 9, color: P.rock },
  { r: 1.4, h: 6, color: P.snow },
];

export default function MountainPeak() {
  const baseY = useMemo(() => heightAt(MOUNTAIN.x, MOUNTAIN.z), []);

  const segments = useMemo(() => {
    let y = baseY;
    return TIERS.map((tier) => {
      const bottom = y - tier.h * 0.28;
      const centerY = bottom + tier.h / 2;
      y = bottom + tier.h;
      return { ...tier, centerY };
    });
  }, [baseY]);

  const cloudY = baseY + 20;

  return (
    <group position={[MOUNTAIN.x, 0, MOUNTAIN.z]}>
      {segments.map((seg, i) => (
        <mesh key={i} position={[0, seg.centerY, 0]}>
          <coneGeometry args={[seg.r, seg.h, 7]} />
          <meshStandardMaterial
            color={seg.color}
            emissive={seg.color}
            emissiveIntensity={0.22}
            flatShading
            roughness={0.95}
          />
        </mesh>
      ))}
      {/* A cloud band wrapping the upper slopes sells the "above the clouds" framing. */}
      <Sparkles
        count={80}
        scale={[24, 3, 24]}
        position={[0, cloudY, 0]}
        size={4.5}
        speed={0.15}
        color="#ffffff"
        opacity={0.55}
      />
    </group>
  );
}

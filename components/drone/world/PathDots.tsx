"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";
import { EXPERIENCE_TRAIL, PAD } from "@/lib/drone/layout";
import { heightAt } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";

// Faint lavender markers tracing the experience trail from the helipad.
export default function PathDots() {
  const dots = useMemo(() => {
    const points: [number, number][] = [[PAD.x, PAD.z], ...EXPERIENCE_TRAIL];
    const out: [number, number, number][] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, z0] = points[i];
      const [x1, z1] = points[i + 1];
      for (let s = 1; s <= 6; s++) {
        const t = s / 7;
        const x = x0 + (x1 - x0) * t;
        const z = z0 + (z1 - z0) * t;
        out.push([x, heightAt(x, z) + 0.12, z]);
      }
    }
    return out;
  }, []);

  return (
    <Instances limit={dots.length} frustumCulled={false}>
      <cylinderGeometry args={[0.18, 0.18, 0.05, 8]} />
      <meshBasicMaterial color={P.lavender} transparent opacity={0.45} />
      {dots.map((p, i) => (
        <Instance key={i} position={p} />
      ))}
    </Instances>
  );
}

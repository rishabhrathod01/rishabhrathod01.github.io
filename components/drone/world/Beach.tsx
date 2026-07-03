"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@/lib/drone/terrain";
import { BEACH } from "@/lib/drone/layout";
import { P } from "@/lib/drone/palette";

const FROND_COUNT = 6;

const PALMS = [
  { x: -6, z: -3, rot: 0.4, lean: 0.18, scale: 1.1 },
  { x: 3, z: 4, rot: 2.1, lean: 0.12, scale: 0.95 },
  { x: 8, z: -5, rot: 4.0, lean: 0.22, scale: 1.2 },
  { x: -2, z: 8, rot: 1.2, lean: 0.15, scale: 1.0 },
];

function Palm({
  x,
  z,
  rot,
  lean,
  scale,
}: {
  x: number;
  z: number;
  rot: number;
  lean: number;
  scale: number;
}) {
  const y = useMemo(() => heightAt(BEACH.x + x, BEACH.z + z), [x, z]);
  const leanX = Math.sin(lean) * 2.6;

  return (
    <group position={[BEACH.x + x, y, BEACH.z + z]} rotation={[0, rot, 0]} scale={scale}>
      {/* Curved trunk: two angled segments leaning further with height. */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, lean * 0.4]}>
        <cylinderGeometry args={[0.16, 0.22, 3.2, 6]} />
        <meshStandardMaterial color={P.trunk} emissive={P.trunk} emissiveIntensity={0.15} roughness={0.85} />
      </mesh>
      <mesh position={[Math.sin(lean) * 1.4, 3.6, 0]} rotation={[0, 0, lean]}>
        <cylinderGeometry args={[0.1, 0.16, 2.6, 6]} />
        <meshStandardMaterial color={P.trunk} emissive={P.trunk} emissiveIntensity={0.15} roughness={0.85} />
      </mesh>
      {/* Fronds: planes fanned around the crown, tilted down for a droop. */}
      <group position={[leanX, 4.9, 0]}>
        {Array.from({ length: FROND_COUNT }).map((_, i) => {
          const frondColor = i % 2 === 0 ? P.canopy : P.grassTip;
          return (
          <group key={i} rotation={[0.9, (i / FROND_COUNT) * Math.PI * 2, 0]}>
            <mesh position={[0, 1.3, 0]}>
              <planeGeometry args={[0.45, 2.6]} />
              <meshStandardMaterial
                color={frondColor}
                emissive={frondColor}
                emissiveIntensity={0.18}
                flatShading
                roughness={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          );
        })}
      </group>
    </group>
  );
}

// Vagator Beach — sandy cove (terrain colour handled in lib/drone/terrain.ts)
// dressed with a handful of hand-placed palms around the video board.
export default function Beach() {
  return (
    <group>
      {PALMS.map((p, i) => (
        <Palm key={i} {...p} />
      ))}
    </group>
  );
}

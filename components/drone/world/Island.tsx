"use client";

import { useMemo } from "react";
import { generateTerrainGeometry } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";

export default function Island() {
  const geometry = useMemo(() => generateTerrainGeometry(), []);
  return (
    <>
      <mesh geometry={geometry}>
        {/* A small self-emissive floor keeps backlit slopes (hills facing
            away from the sun at dusk) from crushing to pure black. */}
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.95}
          emissive={P.grassHi}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* One flat disc reads as both the pond surface and the surrounding
          sea — the moonlight specular streak sells it without shaders. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <circleGeometry args={[90, 48]} />
        <meshStandardMaterial
          color={P.water}
          metalness={0.75}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}

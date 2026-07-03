"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import { WATERFALL } from "@/lib/drone/layout";
import { P } from "@/lib/drone/palette";

const ROCKS = [
  { x: 0, z: 0, s: 3.2, h: 8, rot: 0 },
  { x: -2.4, z: 1.4, s: 2.1, h: 5.5, rot: 1.1 },
  { x: 2.6, z: 1.1, s: 2.4, h: 6, rot: 2.3 },
];

const CASCADES = [
  { x: -0.5, z: 0.4, w: 1.1, topY: 7.2, botY: 0.3 },
  { x: 0.7, z: -0.1, w: 0.9, topY: 6.3, botY: 0.3 },
];

/** Small tileable streak texture, scrolled each frame for a flowing look —
 *  cheaper and simpler than a real fluid sim, matches the game's
 *  texture-free-except-where-necessary style. */
function buildStreakTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#bfe3ff";
  ctx.fillRect(0, 0, 32, 64);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    const x = (i * 7) % 32;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 4, 64);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  return tex;
}

// Shivanasamudra Falls — a rock cliff at the pond's edge with cascading
// water flowing down into it, plus base mist.
export default function Waterfall() {
  const baseY = useMemo(() => heightAt(WATERFALL.x, WATERFALL.z), []);
  const texture = useMemo(buildStreakTexture, []);

  useFrame((_, dt) => {
    texture.offset.y -= dt * 0.6;
  });

  return (
    <group position={[WATERFALL.x, baseY, WATERFALL.z]}>
      {ROCKS.map((r, i) => (
        <mesh
          key={i}
          position={[r.x, r.h / 2 - 0.3, r.z]}
          scale={[r.s, r.h / 3, r.s]}
          rotation={[0.15, r.rot, 0.08]}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={P.rock}
            emissive={P.rock}
            emissiveIntensity={0.18}
            flatShading
            roughness={0.9}
          />
        </mesh>
      ))}
      {CASCADES.map((c, i) => (
        <mesh key={i} position={[c.x, (c.topY + c.botY) / 2, c.z]}>
          <planeGeometry args={[c.w, c.topY - c.botY]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.85}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <Sparkles
        count={40}
        scale={[4, 2, 3]}
        position={[0, 0.6, 0]}
        size={2}
        speed={0.4}
        color="#ffffff"
        opacity={0.6}
      />
    </group>
  );
}

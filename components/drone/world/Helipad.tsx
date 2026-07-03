"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PAD } from "@/lib/drone/layout";
import { heightAt } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";

const CORNERS: [number, number][] = [
  [2.9, 2.9],
  [-2.9, 2.9],
  [2.9, -2.9],
  [-2.9, -2.9],
];

export default function Helipad() {
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const cornerRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const y = heightAt(PAD.x, PAD.z);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringMat.current) {
      ringMat.current.emissiveIntensity = 1.2 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.8;
    }
    cornerRefs.current.forEach((mat, i) => {
      // Alternating blink, like real pad lights.
      if (mat) mat.opacity = 0.35 + (Math.sin(t * 3 + (i % 2) * Math.PI) * 0.5 + 0.5) * 0.65;
    });
  });

  return (
    <group position={[PAD.x, y, PAD.z]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[4, 4.3, 0.36, 32]} />
        <meshStandardMaterial color="#12182b" roughness={0.7} />
      </mesh>
      {/* Pulsing lavender ring — the hero shot's beacon */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.09, 12, 64]} />
        <meshStandardMaterial
          ref={ringMat}
          color={P.lavender}
          emissive={P.lavender}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* "H" marking */}
      <group position={[0, 0.375, 0]}>
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.28, 0.02, 2.2]} />
          <meshStandardMaterial color="#e8eaf6" emissive="#e8eaf6" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.28, 0.02, 2.2]} />
          <meshStandardMaterial color="#e8eaf6" emissive="#e8eaf6" emissiveIntensity={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.1, 0.02, 0.28]} />
          <meshStandardMaterial color="#e8eaf6" emissive="#e8eaf6" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* Corner landing lights */}
      {CORNERS.map(([cx, cz], i) => (
        <mesh key={i} position={[cx, 0.45, cz]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial
            ref={(el) => {
              cornerRefs.current[i] = el;
            }}
            color={P.emerald}
            transparent
          />
        </mesh>
      ))}
      <pointLight color={P.lavender} intensity={2.5} distance={14} position={[0, 3, 0]} />
    </group>
  );
}

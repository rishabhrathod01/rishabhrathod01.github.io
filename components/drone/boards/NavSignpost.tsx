"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";
import { registerInteractable, useDroneStore } from "../store";

const MONO_FONT = "/fonts/JetBrainsMono-Bold.ttf";

// Arrow-plank silhouette shared by all signposts — a distinct shape so
// players learn "arrow plank = leaves the world".
function buildArrowGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.15, -0.3);
  s.lineTo(0.75, -0.3);
  s.lineTo(1.2, 0);
  s.lineTo(0.75, 0.3);
  s.lineTo(-1.15, 0.3);
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: false });
}

let arrowGeo: THREE.ExtrudeGeometry | null = null;

export default function NavSignpost({
  id,
  href,
  label,
  x,
  z,
  yRot,
}: {
  id: string;
  href: string;
  label: string;
  x: number;
  z: number;
  yRot: number;
}) {
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const ground = heightAt(x, z);
  const plankY = 2.4;

  const geometry = useMemo(() => {
    if (!arrowGeo) arrowGeo = buildArrowGeometry();
    return arrowGeo;
  }, []);

  useEffect(
    () =>
      registerInteractable({
        id,
        kind: "nav",
        position: [x, ground + plankY, z],
        radius: 7,
        label: `FLY TO ${href}`,
        href,
      }),
    [id, href, x, z, ground]
  );

  useFrame((_, dt) => {
    if (glowMat.current) {
      const inRange = useDroneStore.getState().nearest?.id === id;
      glowMat.current.opacity = THREE.MathUtils.lerp(
        glowMat.current.opacity,
        inRange ? 0.55 : 0.22,
        dt * 5
      );
    }
  });

  return (
    <group position={[x, ground, z]} rotation={[0, yRot, 0]}>
      {/* Pole */}
      <mesh position={[-0.6, plankY / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, plankY + 0.6, 6]} />
        <meshStandardMaterial color="#1a2138" roughness={0.8} />
      </mesh>
      {/* Glow halo */}
      <mesh position={[0, plankY, -0.06]} scale={[1.12, 1.25, 1]}>
        <planeGeometry args={[2.4, 0.62]} />
        <meshBasicMaterial
          ref={glowMat}
          color={P.emerald}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Arrow plank */}
      <mesh geometry={geometry} position={[0, plankY, -0.04]}>
        <meshStandardMaterial color="#0f1729" transparent opacity={0.92} roughness={0.35} />
      </mesh>
      <Text
        font={MONO_FONT}
        fontSize={0.2}
        color={P.emerald}
        anchorX="center"
        anchorY="middle"
        position={[-0.1, plankY, 0.1]}
        letterSpacing={0.12}
      >
        {`→ ${label}`}
      </Text>
    </group>
  );
}

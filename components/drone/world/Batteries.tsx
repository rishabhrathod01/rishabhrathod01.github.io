"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BATTERY_CELLS } from "@/lib/drone/layout";
import { heightAt } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";
import { registerInteractable, useDroneStore } from "../store";

// Eight collectible battery cells — the exploration easter egg.
function Cell({ id, x, z, yOffset }: { id: string; x: number; z: number; yOffset: number }) {
  const group = useRef<THREE.Group>(null);
  const y = heightAt(x, z) + yOffset;

  useEffect(
    () =>
      registerInteractable({
        id,
        kind: "collect",
        position: [x, y, z],
        radius: 1.6,
        label: "",
      }),
    [id, x, y, z]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 1.2;
      group.current.position.y = y + Math.sin(t * 1.6 + x) * 0.25;
    }
  });

  return (
    <group ref={group} position={[x, y, z]}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 8]} />
        <meshStandardMaterial
          color={P.emerald}
          emissive={P.emerald}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 8]} />
        <meshStandardMaterial color={P.emerald} emissive={P.emerald} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Batteries() {
  const cells = useDroneStore((s) => s.cells);
  return (
    <>
      {BATTERY_CELLS.filter((c) => !cells.includes(c.id)).map((c) => (
        <Cell key={c.id} id={c.id} x={c.x} z={c.z} yOffset={c.yOffset} />
      ))}
    </>
  );
}

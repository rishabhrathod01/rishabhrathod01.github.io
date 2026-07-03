"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import { RACE_RINGS, RACE_TIME_LIMIT } from "@/lib/drone/layout";
import { P } from "@/lib/drone/palette";
import { race, useDroneStore } from "../store";

const MONO_FONT = "/fonts/JetBrainsMono-Bold.ttf";

const cGold = new THREE.Color(P.gold);
const cPassed = new THREE.Color(P.emerald);
const cFinish = new THREE.Color(P.lavender);

interface RingVisual {
  id: string;
  worldPos: THREE.Vector3;
  quat: THREE.Quaternion;
  normal: THREE.Vector3;
  yaw: number;
  radius: number;
  finish: boolean;
  label: string;
}

/** Teaser at the hidden start gate — only when the briefing board is in range. */
function ChallengeStartSign({ ring }: { ring: RingVisual }) {
  const width = 4.4;
  const height = 2.3;
  const pos = ring.worldPos.clone().addScaledVector(ring.normal, -5.5);

  return (
    <group position={pos} rotation={[0, ring.yaw, 0]}>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.14, height + 0.14]} />
        <meshBasicMaterial
          color={P.gold}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[width, height, 0.07]} />
        <meshStandardMaterial color="#0f1729" transparent opacity={0.86} roughness={0.3} metalness={0.1} />
      </mesh>
      <Text
        font={MONO_FONT}
        fontSize={0.24}
        color={P.gold}
        anchorX="center"
        anchorY="top"
        position={[0, height / 2 - 0.32, 0.06]}
        letterSpacing={0.12}
      >
        RING CHALLENGE
      </Text>
      <Text
        font={MONO_FONT}
        fontSize={0.15}
        color="#dce1fb"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.05, 0.06]}
        letterSpacing={0.03}
        maxWidth={width - 0.5}
        textAlign="center"
      >
        {`${RACE_RINGS.length} RINGS · ${Math.floor(RACE_TIME_LIMIT / 60)}:${String(RACE_TIME_LIMIT % 60).padStart(2, "0")} LIMIT`}
      </Text>
      <Text
        font={MONO_FONT}
        fontSize={0.13}
        color={P.emerald}
        anchorX="center"
        anchorY="bottom"
        position={[0, -height / 2 + 0.3, 0.06]}
        letterSpacing={0.06}
        maxWidth={width - 0.5}
        textAlign="center"
      >
        [E] READ BRIEFING ON THE BOARD
      </Text>
    </group>
  );
}

// Rings render only after Enter confirms the run. A start-gate sign appears
// near ring 1 when the pilot is in range of the briefing board.
export default function RaceRings() {
  const raceStatus = useDroneStore((s) => s.raceStatus);
  const raceBoardNearby = useDroneStore((s) => s.raceBoardNearby);
  const revealed = raceStatus === "running";
  const showStartSign = raceBoardNearby && raceStatus !== "running";

  const rings = useMemo<RingVisual[]>(() => {
    const positions = RACE_RINGS.map(
      (r) => new THREE.Vector3(r.x, heightAt(r.x, r.z) + r.alt, r.z)
    );
    return RACE_RINGS.map((r, i) => {
      const from = positions[Math.max(i - 1, 0)];
      const to = positions[Math.min(i + 1, positions.length - 1)];
      const normal = new THREE.Vector3().subVectors(to, from);
      if (normal.lengthSq() < 1e-6) normal.set(0, 0, 1);
      normal.normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      return {
        id: r.id,
        worldPos: positions[i],
        quat,
        normal,
        yaw: Math.atan2(-normal.x, -normal.z),
        radius: r.radius,
        finish: Boolean(r.finish),
        label: r.finish ? "FINISH" : String(i + 1),
      };
    });
  }, []);

  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame((state) => {
    if (!revealed) return;
    const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2.2) * 0.3;
    rings.forEach((ring, i) => {
      const mat = matRefs.current[i];
      if (!mat) return;
      const passed = race.passedIds.has(ring.id);
      const target = ring.finish ? cFinish : passed ? cPassed : cGold;
      mat.color.lerp(target, 0.08);
      mat.emissive.lerp(target, 0.08);
      mat.emissiveIntensity = (ring.finish ? 1.7 : 1.3) * pulse;
    });
  });

  return (
    <>
      {revealed &&
        rings.map((ring, i) => (
          <group key={ring.id} position={ring.worldPos}>
            <mesh quaternion={ring.quat}>
              <torusGeometry args={[ring.radius, 0.28, 12, 32]} />
              <meshStandardMaterial
                ref={(el) => {
                  matRefs.current[i] = el;
                }}
                color={P.gold}
                emissive={P.gold}
                emissiveIntensity={1.3}
                toneMapped={false}
                roughness={0.4}
              />
            </mesh>
            <Text
              font={MONO_FONT}
              fontSize={0.9}
              color={ring.finish ? P.lavender : P.gold}
              anchorX="center"
              anchorY="middle"
              position={[0, ring.radius + 1.1, 0]}
              rotation={[0, ring.yaw, 0]}
              letterSpacing={0.05}
            >
              {ring.label}
            </Text>
          </group>
        ))}
      {showStartSign && rings[0] && <ChallengeStartSign ring={rings[0]} />}
    </>
  );
}

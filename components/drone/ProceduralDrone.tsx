"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { flight } from "./store";
import { P } from "@/lib/drone/palette";

// Procedural DJI Mini 4 Pro (ported from the original vanilla-three
// implementation). Used as instant first paint and as fallback when the
// real glb is missing.

const ARM_LENGTH = 1.1;

interface ArmSpec {
  front: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  lengthFactor: number; // rear arms are slightly shorter
  offsetFactor: number; // how far along the arm the origin shifts
}

const ARMS: ArmSpec[] = [
  { front: true, position: [-0.35, 0, -0.45], rotation: [0, Math.PI / 4 + 0.1, 0.04], lengthFactor: 1, offsetFactor: 0.5 },
  { front: true, position: [0.35, 0, -0.45], rotation: [0, -Math.PI / 4 - 0.1, -0.04], lengthFactor: 1, offsetFactor: 0.5 },
  { front: false, position: [-0.3, -0.05, 0.35], rotation: [0, (3 * Math.PI) / 4 - 0.1, -0.02], lengthFactor: 0.95, offsetFactor: 0.45 },
  { front: false, position: [0.3, -0.05, 0.35], rotation: [0, (-3 * Math.PI) / 4 + 0.1, 0.02], lengthFactor: 0.95, offsetFactor: 0.45 },
];

export default function ProceduralDrone() {
  const propRefs = useRef<(THREE.Group | null)[]>([]);
  const ledRefs = useRef<(THREE.Mesh | null)[]>([]);

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#c8cbcc", roughness: 0.18, metalness: 0.25 }),
      darkGrey: new THREE.MeshStandardMaterial({ color: "#2a2d30", roughness: 0.4, metalness: 0.3 }),
      lens: new THREE.MeshStandardMaterial({ color: "#08080a", roughness: 0.05, metalness: 0.9 }),
      carbon: new THREE.MeshStandardMaterial({ color: "#1d1f21", roughness: 0.6, metalness: 0.5 }),
      blade: new THREE.MeshStandardMaterial({ color: "#18181a", transparent: true, opacity: 0.92, roughness: 0.5 }),
      ledGreen: new THREE.MeshBasicMaterial({ color: P.ledGreen, transparent: true }),
      ledRed: new THREE.MeshBasicMaterial({ color: P.ledRed, transparent: true }),
    }),
    []
  );

  useFrame((state, dt) => {
    // Alternating CW/CCW spin, speed follows the shared propSpin fraction.
    const radPerSec = 4 + flight.propSpin * 45;
    propRefs.current.forEach((prop, i) => {
      if (prop) prop.rotation.y += radPerSec * dt * (i % 2 === 0 ? 1 : -1);
    });
    const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
    ledRefs.current.forEach((led) => {
      if (led) (led.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;
    });
  });

  return (
    <group scale={0.6}>
      {/* Fuselage */}
      <mesh material={materials.body}>
        <boxGeometry args={[0.8, 0.4, 1.8]} />
      </mesh>
      {/* Nose cap */}
      <mesh material={materials.body} position={[0, -0.05, -0.9]} scale={[1, 0.75, 1.25]}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
      {/* Gimbal + lens */}
      <mesh material={materials.darkGrey} position={[0, -0.2, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
      </mesh>
      <mesh material={materials.lens} position={[0, -0.2, -1.1]}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>
      {/* Battery pack */}
      <mesh material={materials.darkGrey} position={[0, 0.15, 0.4]}>
        <boxGeometry args={[0.68, 0.25, 0.8]} />
      </mesh>

      {ARMS.map((arm, i) => {
        const len = ARM_LENGTH * arm.lengthFactor;
        const yRot = arm.rotation[1];
        const pos: [number, number, number] = [
          arm.position[0] - ARM_LENGTH * arm.offsetFactor * Math.sin(yRot),
          arm.position[1],
          arm.position[2] - ARM_LENGTH * arm.offsetFactor * Math.cos(yRot),
        ];
        const tipZ = len / 2 - 0.05;
        return (
          <group key={i} position={pos} rotation={arm.rotation}>
            <mesh material={materials.carbon}>
              <boxGeometry args={[0.12, 0.08, len]} />
            </mesh>
            {/* Motor hub */}
            <mesh material={materials.darkGrey} position={[0, 0.08, tipZ]}>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 12]} />
            </mesh>
            {/* Propeller */}
            <group
              ref={(el) => {
                propRefs.current[i] = el;
              }}
              position={[0, 0.17, tipZ]}
            >
              <mesh material={materials.blade}>
                <boxGeometry args={[0.06, 0.01, 0.8]} />
              </mesh>
              <mesh material={materials.blade} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[0.06, 0.01, 0.8]} />
              </mesh>
            </group>
            {/* Nav LED */}
            <mesh
              ref={(el) => {
                ledRefs.current[i] = el;
              }}
              material={arm.front ? materials.ledGreen : materials.ledRed}
              position={[0, -0.06, tipZ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

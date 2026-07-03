"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { flight, useDroneStore } from "./store";
import { P } from "@/lib/drone/palette";
import ProceduralDrone from "./ProceduralDrone";

// Hero idle: model local nose is -Z; +PI on the mesh faces the homepage camera (+Z).
const IDLE_FACE_YAW = Math.PI;

// Keep the URL centralised: if the site ever gains a basePath, this is the
// one place to prefix.
export const DRONE_MODEL_URL = "/models/dji-mini-4-pro.glb";
const DRACO_PATH = "/draco/";
const LAUNCH_DURATION = 2.6;

// Export is Y-up, nose -Z. Flight keeps that; hero idle adds +PI so the gimbal
// faces the homepage camera while the chase cam sees the back in flight.
const MODEL_ADJUST = { targetWidth: 1.15 };

/** Idle = front toward user; flight = back toward chase cam. */
function DroneFaceWrapper({ children }: { children: ReactNode }) {
  const phase = useDroneStore((s) => s.phase);
  const faceRef = useRef<THREE.Group>(null);
  const launchT = useRef(0);

  useEffect(() => {
    if (phase === "launching") launchT.current = 0;
  }, [phase]);

  useFrame((_, dt) => {
    const g = faceRef.current;
    if (!g) return;

    if (phase === "launching") launchT.current += dt;

    let target = 0;
    if (phase === "idle" || phase === "charging") {
      target = IDLE_FACE_YAW;
    } else if (phase === "launching") {
      const k = Math.min(launchT.current / LAUNCH_DURATION, 1);
      target = THREE.MathUtils.lerp(IDLE_FACE_YAW, 0, k);
    }

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target, dt * 8);
  });

  return <group ref={faceRef}>{children}</group>;
}

/** HEAD-check so a missing glb deterministically falls back to the
 *  procedural drone instead of erroring inside Suspense. */
function useAssetAvailable(url: string): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => !cancelled && setAvailable(res.ok))
      .catch(() => !cancelled && setAvailable(false));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return available;
}

function GltfDrone() {
  const { scene } = useGLTF(DRONE_MODEL_URL, DRACO_PATH);
  const discRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ledRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { model, motorOffsets, discRadius } = useMemo(() => {
    const model = scene.clone(true);
    // Normalize: centre at origin, scale to a known footprint so physics,
    // camera and prop-disc placement don't depend on the export's units.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = MODEL_ADJUST.targetWidth / Math.max(size.x, size.z);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // The glb has no named propeller nodes, so motor positions are derived
    // from the bounding box: four corners of the arm span.
    const sx = size.x * scale;
    const sy = size.y * scale;
    const sz = size.z * scale;
    const motorOffsets: [number, number, number][] = [
      [-0.36 * sx, 0.3 * sy, -0.3 * sz], // front left
      [0.36 * sx, 0.3 * sy, -0.3 * sz], // front right
      [-0.36 * sx, 0.3 * sy, 0.32 * sz], // rear left
      [0.36 * sx, 0.3 * sy, 0.32 * sz], // rear right
    ];
    return { model, motorOffsets, discRadius: 0.19 * Math.max(sx, sz) };
  }, [scene]);

  useFrame((state) => {
    // Spinning props at speed read as translucent blur discs — opacity
    // tracks the shared propSpin fraction (idle = faint shimmer, flight =
    // solid disc). A uniform disc needs no actual rotation.
    const spin = flight.propSpin;
    const flicker = 0.9 + Math.sin(state.clock.elapsedTime * 40) * 0.1;
    discRefs.current.forEach((disc) => {
      if (!disc) return;
      (disc.material as THREE.MeshBasicMaterial).opacity =
        (0.08 + spin * 0.3) * flicker;
    });
    const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
    ledRefs.current.forEach((led) => {
      if (led) (led.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;
    });
  });

  return (
    <group>
      <primitive object={model} />
      {motorOffsets.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh
            ref={(el) => {
              discRefs.current[i] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[discRadius, 24]} />
            <meshBasicMaterial
              color="#9aa2b8"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh
            ref={(el) => {
              ledRefs.current[i] = el;
            }}
            position={[0, -0.12, 0]}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={i < 2 ? P.ledGreen : P.ledRed} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function DroneModel() {
  const available = useAssetAvailable(DRONE_MODEL_URL);

  // Start fetching/decoding in parallel with the HEAD check.
  useEffect(() => {
    useGLTF.preload(DRONE_MODEL_URL, DRACO_PATH);
  }, []);

  // Still checking whether the glb exists — render nothing.
  if (available === null) return null;

  // glb missing — procedural mesh is synchronous, show immediately.
  if (available === false) {
    return (
      <DroneFaceWrapper>
        <ProceduralDrone />
      </DroneFaceWrapper>
    );
  }

  // glb exists — Suspense keeps the drone hidden until Draco decode finishes.
  return (
    <Suspense fallback={null}>
      <DroneFaceWrapper>
        <GltfDrone />
      </DroneFaceWrapper>
    </Suspense>
  );
}

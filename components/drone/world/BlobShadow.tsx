"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { flight } from "../store";
import { heightAt } from "@/lib/drone/terrain";

// No shadow maps anywhere — the drone gets a soft radial-gradient blob that
// tracks the terrain under it, shrinking/fading with altitude.
export default function BlobShadow() {
  const mesh = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { x, z } = flight.pos;
    const ground = heightAt(x, z);
    const alt = Math.max(flight.pos.y - ground, 0);
    m.position.set(x, ground + 0.06, z);
    const s = THREE.MathUtils.clamp(1.7 - alt * 0.045, 0.5, 1.7);
    m.scale.setScalar(s);
    (m.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.clamp(
      0.5 - alt * 0.015,
      0.06,
      0.5
    );
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.4, 2.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

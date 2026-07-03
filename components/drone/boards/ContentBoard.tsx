"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import { registerInteractable, useDroneStore } from "../store";

const MONO_FONT = "/fonts/JetBrainsMono-Bold.ttf";
const GEIST_FONT = "/fonts/Geist-SemiBold.ttf";

const MICRO_TOP = 0.2;
const TITLE_TOP = 0.48;
const SUB_GAP = 0.14;
const CHIP_BOTTOM = 0.22;

/** Keep 3D previews short — full copy lives in the focus panel. */
function previewText(text: string, maxLen = 58): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

export interface ContentBoardProps {
  id: string;
  x: number;
  z: number;
  /** Y rotation; the panel faces +Z rotated by this. */
  yRot: number;
  accent: string;
  micro: string;
  title: string;
  sub?: string;
  width?: number;
  height?: number;
  /** Panel centre height above ground. */
  elevation?: number;
  focusLabel?: string;
  children?: ReactNode;
}

// The reusable glass board: two posts, a dark translucent panel, an emissive
// glow plane behind it (reads as a luminous border), and troika SDF text.
// Paragraphs live in the DOM FocusPanel, never in 3D.
export default function ContentBoard({
  id,
  x,
  z,
  yRot,
  accent,
  micro,
  title,
  sub,
  width = 3.2,
  height = 1.9,
  elevation = 2.7,
  focusLabel,
  children,
}: ContentBoardProps) {
  const panel = useRef<THREE.Group>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const ground = heightAt(x, z);
  const panelY = ground + elevation;
  const bobPhase = x * 1.7 + z * 0.9;
  const titleY = height / 2 - TITLE_TOP;
  const [subY, setSubY] = useState(titleY - 0.5);
  const displaySub = sub ? previewText(sub) : undefined;

  const syncSubPosition = (troika: {
    textRenderInfo?: { blockBounds?: [number, number, number, number] };
  }) => {
    const bounds = troika.textRenderInfo?.blockBounds;
    if (!bounds) return;
    const minY = bounds[1];
    const nextSubY = titleY + minY - SUB_GAP;
    const subFloor = -height / 2 + CHIP_BOTTOM + 0.28;
    setSubY(Math.max(nextSubY, subFloor));
  };

  useEffect(() => {
    setSubY(titleY - 0.5);
  }, [title, titleY, width]);

  useEffect(() => {
    if (!focusLabel) return;
    // Focus camera: in front of the panel along its normal.
    const nx = Math.sin(yRot);
    const nz = Math.cos(yRot);
    return registerInteractable({
      id,
      kind: "focus",
      position: [x, panelY, z],
      radius: 6,
      label: focusLabel,
      camPos: [x + nx * 5.2, panelY + 0.4, z + nz * 5.2],
      camLook: [x, panelY, z],
    });
  }, [id, x, z, yRot, panelY, focusLabel]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (panel.current) {
      panel.current.position.y = panelY - ground + Math.sin(t * 0.7 + bobPhase) * 0.05;
      panel.current.rotation.z = Math.sin(t * 0.5 + bobPhase) * 0.008;
    }
    if (glowMat.current) {
      const inRange = useDroneStore.getState().nearest?.id === id;
      glowMat.current.opacity = THREE.MathUtils.lerp(
        glowMat.current.opacity,
        inRange ? 0.5 : 0.2,
        dt * 5
      );
    }
  });

  const postX = width / 2 - 0.35;

  return (
    <group position={[x, ground, z]} rotation={[0, yRot, 0]}>
      {/* Posts, leaning slightly inward */}
      <mesh position={[-postX, elevation / 2 - 0.4, -0.08]} rotation={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.05, 0.07, elevation - 0.5, 6]} />
        <meshStandardMaterial color="#1a2138" roughness={0.8} />
      </mesh>
      <mesh position={[postX, elevation / 2 - 0.4, -0.08]} rotation={[0, 0, -0.04]}>
        <cylinderGeometry args={[0.05, 0.07, elevation - 0.5, 6]} />
        <meshStandardMaterial color="#1a2138" roughness={0.8} />
      </mesh>

      <group ref={panel} position={[0, elevation, 0]}>
        {/* Glow halo behind the panel = luminous border */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[width + 0.14, height + 0.14]} />
          <meshBasicMaterial
            ref={glowMat}
            color={accent}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Glass panel */}
        <mesh>
          <boxGeometry args={[width, height, 0.07]} />
          <meshStandardMaterial
            color="#0f1729"
            transparent
            opacity={0.86}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        <Text
          font={MONO_FONT}
          fontSize={0.13}
          color={accent}
          anchorX="left"
          anchorY="top"
          position={[-width / 2 + 0.22, height / 2 - MICRO_TOP, 0.06]}
          letterSpacing={0.15}
          maxWidth={width - 0.4}
        >
          {micro.toUpperCase()}
        </Text>
        <Text
          font={GEIST_FONT}
          fontSize={0.26}
          color="#dce1fb"
          anchorX="left"
          anchorY="top"
          position={[-width / 2 + 0.22, titleY, 0.06]}
          maxWidth={width - 0.4}
          lineHeight={1.15}
          onSync={syncSubPosition}
        >
          {title}
        </Text>
        {displaySub && (
          <Text
            font={GEIST_FONT}
            fontSize={0.14}
            color="#8f97b8"
            anchorX="left"
            anchorY="top"
            position={[-width / 2 + 0.22, subY, 0.06]}
            maxWidth={width - 0.44}
            lineHeight={1.35}
          >
            {displaySub}
          </Text>
        )}
        {focusLabel && (
          <Text
            font={MONO_FONT}
            fontSize={0.11}
            color={accent}
            anchorX="right"
            anchorY="bottom"
            position={[width / 2 - 0.2, -height / 2 + 0.16, 0.06]}
            letterSpacing={0.1}
          >
            [E] READ
          </Text>
        )}
        {children}
      </group>
    </group>
  );
}

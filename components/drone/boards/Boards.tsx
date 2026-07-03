"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { heightAt } from "@/lib/drone/terrain";
import type { FlightContent } from "../types";
import {
  EXPERIENCE_TRAIL,
  ABOUT_BOARD,
  PROJECT_BILLBOARDS,
  NAV_SIGNPOSTS,
  HIDDEN_BOARD,
  VIDEO_BOARDS,
} from "@/lib/drone/layout";
import { P } from "@/lib/drone/palette";
import { useDroneStore } from "../store";
import ContentBoard from "./ContentBoard";
import NavSignpost from "./NavSignpost";

const MONO_FONT = "/fonts/JetBrainsMono-Bold.ttf";

/** Face the island centre — boards greet the approaching drone.
 *  Panel normal is (sin θ, 0, cos θ); point it toward (−x, −z). */
function faceCenter(x: number, z: number): number {
  return Math.atan2(-x, -z);
}

/** Compact period like "2019—2021" from "July 2019 - June 2021". */
function shortPeriod(period: string): string {
  const years = period.match(/\d{4}|Present/gi);
  return years ? Array.from(new Set(years)).join("—") : period;
}

export function ExperienceTrail({ content }: { content: FlightContent }) {
  // Trail is oldest→newest; lib/data.ts is newest→oldest.
  const chronological = [...content.experience].reverse();
  return (
    <>
      {chronological.map((exp, i) => {
        const [x, z] = EXPERIENCE_TRAIL[i] ?? EXPERIENCE_TRAIL[EXPERIENCE_TRAIL.length - 1];
        const originalIndex = content.experience.length - 1 - i;
        return (
          <ContentBoard
            key={`exp-${originalIndex}`}
            id={`exp-${originalIndex}`}
            x={x}
            z={z}
            yRot={faceCenter(x, z)}
            accent={P.lavender}
            micro={`EXP ${String(i + 1).padStart(2, "0")} / ${exp.company} · ${shortPeriod(exp.period)}`}
            title={exp.position}
            sub={exp.description}
            elevation={2.5 + i * 0.18} // posts grow along the career ascent
            focusLabel={`READ — ${exp.company} (${shortPeriod(exp.period)})`}
          />
        );
      })}
    </>
  );
}

export function AboutBoard({ content }: { content: FlightContent }) {
  return (
    <ContentBoard
      id="about"
      x={ABOUT_BOARD.x}
      z={ABOUT_BOARD.z}
      yRot={0} // faces the helipad — the first thing the pilot sees
      accent={P.lavender}
      micro="00 / PILOT PROFILE"
      title={content.personal.name}
      sub={content.personal.role + " · " + content.personal.location}
      width={3.6}
      height={2}
      focusLabel="READ — About the pilot"
    />
  );
}

export function ProjectBillboards({ content }: { content: FlightContent }) {
  return (
    <>
      {content.projects.slice(0, 2).map((proj, i) => {
        const [x, z] = PROJECT_BILLBOARDS[i];
        return (
          <ContentBoard
            key={`proj-${i}`}
            id={`proj-${i}`}
            x={x}
            z={z}
            yRot={faceCenter(x, z)}
            accent={P.emerald}
            micro={`PROJECT ${String(i + 1).padStart(2, "0")} / ${proj.tags[0] ?? ""}`}
            title={proj.title}
            sub={proj.description.split(". ")[0] + "."}
            width={4.2}
            height={2.4}
            elevation={3}
            focusLabel={`READ — ${proj.title}`}
          >
            {/* Texture-free preview art */}
            {i === 0 ? <DiffPreview /> : (
              <Text
                font={MONO_FONT}
                fontSize={0.34}
                color={P.emerald}
                anchorX="right"
                anchorY="middle"
                position={[4.2 / 2 - 0.25, -0.45, 0.06]}
                letterSpacing={0.05}
              >
                {"{ } → ( )"}
              </Text>
            )}
          </ContentBoard>
        );
      })}
    </>
  );
}

/** Tiny emissive diff-block pattern for the DiffyCurl billboard. */
function DiffPreview() {
  const rows: { w: number; y: number; add: boolean }[] = [
    { w: 0.7, y: -0.3, add: true },
    { w: 0.5, y: -0.5, add: false },
    { w: 0.85, y: -0.7, add: true },
    { w: 0.4, y: -0.9, add: false },
  ];
  return (
    <group position={[4.2 / 2 - 1.3, 0, 0.06]}>
      {rows.map((r, i) => (
        <mesh key={i} position={[r.w / 2, r.y, 0]}>
          <planeGeometry args={[r.w, 0.12]} />
          <meshBasicMaterial
            color={r.add ? P.emerald : "#ff5f6d"}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ContentClusters({ content }: { content: FlightContent }) {
  return (
    <>
      {/* Blog + travel focus boards near their signposts */}
      <ContentBoard
        id="blogs"
        x={13}
        z={-40}
        yRot={faceCenter(13, -40)}
        accent={P.emerald}
        micro={`WRITING / ${content.blogs.length} RECENT POSTS`}
        title="From the Blog"
        sub={content.blogs[0]?.title ?? ""}
        focusLabel="READ — Recent blog posts"
      />
      <ContentBoard
        id="travel"
        x={25}
        z={25}
        yRot={faceCenter(25, 25)}
        accent={P.emerald}
        micro={`TRAVEL LOG / ${content.travel.length} STORIES`}
        title="Stories from the Road"
        sub={content.travel[0]?.title ?? ""}
        focusLabel="READ — Travel stories"
      />
    </>
  );
}

export function HiddenBoard() {
  const cells = useDroneStore((s) => s.cells);
  if (cells.length < 8) return null;
  return (
    <ContentBoard
      id="hidden"
      x={HIDDEN_BOARD.x}
      z={HIDDEN_BOARD.z}
      yRot={faceCenter(HIDDEN_BOARD.x, HIDDEN_BOARD.z)}
      accent={P.emerald}
      micro="ALL CELLS COLLECTED"
      title="Batteries full."
      sub="Let's build something together."
      focusLabel="READ — A message for explorers"
    />
  );
}

const VIDEO_BOARD_WIDTH = 4.4;
const VIDEO_BOARD_HEIGHT = 2.4;

export function VideoBoards({ content }: { content: FlightContent }) {
  return (
    <>
      {content.videos.map((video, i) => {
        const pos = VIDEO_BOARDS[i];
        if (!pos) return null;
        return (
          <ContentBoard
            key={video.id}
            id={video.id}
            x={pos.x}
            z={pos.z}
            yRot={faceCenter(pos.x, pos.z)}
            accent={P.videoAccent}
            micro={`DRONE FOOTAGE / ${video.platform.toUpperCase()}`}
            title={video.title}
            sub={video.caption}
            width={VIDEO_BOARD_WIDTH}
            height={VIDEO_BOARD_HEIGHT}
            elevation={3}
            focusLabel={`WATCH — ${video.title}`}
          >
            <VideoThumbnail url={video.thumbnail} boardWidth={VIDEO_BOARD_WIDTH} />
          </ContentBoard>
        );
      })}
    </>
  );
}

/** Thumbnail plane + procedural play button + pulsing "recording" dot. No
 *  font-glyph dependency — the play triangle is geometry, not a character.
 *  Playback only ever starts in the focus panel, opened with E — this board
 *  is a poster, never a live/autoplaying player. */
function VideoThumbnail({ url, boardWidth }: { url: string; boardWidth: number }) {
  const texture = useTexture(url);
  const recDot = useRef<THREE.Mesh>(null);
  const thumbW = 1.7;
  const thumbH = thumbW * (9 / 16);
  const cx = boardWidth / 2 - thumbW / 2 - 0.22;

  useFrame((state) => {
    if (recDot.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      (recDot.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
    }
  });

  return (
    <group position={[cx, 0.08, 0.065]}>
      <mesh>
        <planeGeometry args={[thumbW, thumbH]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Play button */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      {/* circleGeometry(r,3) puts a vertex at angle 0 (+X) — already a
          right-pointing triangle, no rotation needed. */}
      <mesh position={[0.03, 0, 0.002]}>
        <circleGeometry args={[0.11, 3]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      {/* Pulsing recording dot */}
      <mesh ref={recDot} position={[-thumbW / 2 + 0.14, thumbH / 2 - 0.14, 0.002]}>
        <circleGeometry args={[0.05, 12]} />
        <meshBasicMaterial color={P.videoAccent} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

export function NavSignposts() {
  return (
    <>
      {NAV_SIGNPOSTS.map((s) => (
        <NavSignpost
          key={s.id}
          id={s.id}
          href={s.href}
          label={s.label}
          x={s.x}
          z={s.z}
          yRot={faceCenter(s.x, s.z)}
        />
      ))}
    </>
  );
}

/** Wind-sock next to the TRAVEL signpost — a tiny aviation wink. */
export function WindSock() {
  const ground = heightAt(32, 30);
  return (
    <group position={[32, ground, 30]}>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 3.6, 6]} />
        <meshStandardMaterial color="#1a2138" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 3.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 1.4, 8, 1, true]} />
        <meshStandardMaterial
          color="#ff8a5c"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

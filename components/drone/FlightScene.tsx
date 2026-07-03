"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { FlightContent } from "./types";
import { flight, useDroneStore } from "./store";
import { DAY_CYCLE } from "@/lib/drone/palette";
import SkyDome from "./world/SkyDome";
import Island from "./world/Island";
import Vegetation from "./world/Vegetation";
import Fireflies from "./world/Fireflies";
import Helipad from "./world/Helipad";
import PathDots from "./world/PathDots";
import Batteries from "./world/Batteries";
import BlobShadow from "./world/BlobShadow";
import MountainPeak from "./world/MountainPeak";
import Waterfall from "./world/Waterfall";
import Beach from "./world/Beach";
import RaceRings from "./world/RaceRings";
import RaceManager from "./RaceManager";
import {
  ExperienceTrail,
  AboutBoard,
  ProjectBillboards,
  ContentClusters,
  HiddenBoard,
  NavSignposts,
  VideoBoards,
  RaceChallengeBoard,
  WindSock,
} from "./boards/Boards";

// Minutes of flying until the world reaches full sunset.
const SUNSET_AFTER_SECONDS = 180;

const FOG_MORNING = new THREE.Color(DAY_CYCLE.morning.fog);
const FOG_SUNSET = new THREE.Color(DAY_CYCLE.sunset.fog);

// The lazy world chunk. Mounted (and its GPU resources built) during the
// long-press; becomes visible from `launching` onward. Fog starts tight and
// recedes — the island "streams in" out of the morning haze. Fog colour and
// the day cycle track flight time toward sunset.
export default function FlightScene({ content }: { content: FlightContent }) {
  const phase = useDroneStore((s) => s.phase);
  const visible = phase !== "idle" && phase !== "charging";
  const scene = useThree((s) => s.scene);
  const fog = useMemo(() => new THREE.Fog(DAY_CYCLE.morning.fog, 6, 32), []);
  const revealed = useRef(false);

  useEffect(() => {
    if (visible) {
      if (!revealed.current) {
        fog.near = 6;
        fog.far = 32;
      }
      scene.fog = fog;
    } else {
      scene.fog = null;
      revealed.current = false;
    }
    return () => {
      scene.fog = null;
    };
  }, [visible, scene, fog]);

  useFrame((_, dtRaw) => {
    if (!visible) return;
    const dt = Math.min(dtRaw, 0.1);
    fog.near = THREE.MathUtils.lerp(fog.near, 45, dt * 0.9);
    fog.far = THREE.MathUtils.lerp(fog.far, 150, dt * 0.9);
    if (fog.far > 140) revealed.current = true;
    // Day advances only while actually out in the world.
    if (phase === "flight" || phase === "focus") {
      flight.dayT = Math.min(1, flight.dayT + dt / SUNSET_AFTER_SECONDS);
    }
    fog.color.lerpColors(FOG_MORNING, FOG_SUNSET, flight.dayT);
  });

  return (
    <group visible={visible}>
      <SkyDome />
      <Island />
      <Vegetation />
      <Fireflies />
      <Helipad />
      <PathDots />
      <WindSock />
      <MountainPeak />
      <Waterfall />
      <Beach />
      <RaceRings />
      <RaceManager />

      <AboutBoard content={content} />
      <ExperienceTrail content={content} />
      <ProjectBillboards content={content} />
      <ContentClusters content={content} />
      <VideoBoards content={content} />
      <RaceChallengeBoard />
      <HiddenBoard />
      <NavSignposts />

      <Batteries />
      <BlobShadow />
    </group>
  );
}

"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { heightAt } from "@/lib/drone/terrain";
import {
  RACE_RINGS,
  RACE_TIME_LIMIT,
  RACE_CHECKPOINT_POINTS,
  RACE_FINISH_POINTS,
} from "@/lib/drone/layout";
import { flight, race, useDroneStore } from "./store";
import { engineAudio } from "@/lib/drone/audio";

// How far (world units, along the ring's facing axis) the drone can be from
// the ring's plane and still count as "passing through" it.
const CROSS_EPSILON = 1.6;

const tmpToDrone = new THREE.Vector3();
const tmpPerp = new THREE.Vector3();

interface RingRuntime {
  id: string;
  worldPos: THREE.Vector3;
  normal: THREE.Vector3;
  radius: number;
  finish: boolean;
}

/** Checks ring crossings only while a confirmed run is active (started via
 *  Enter on the briefing board). */
export default function RaceManager() {
  const rings = useMemo<RingRuntime[]>(() => {
    const positions = RACE_RINGS.map(
      (r) => new THREE.Vector3(r.x, heightAt(r.x, r.z) + r.alt, r.z)
    );
    return RACE_RINGS.map((r, i) => {
      const from = positions[Math.max(i - 1, 0)];
      const to = positions[Math.min(i + 1, positions.length - 1)];
      const normal = new THREE.Vector3().subVectors(to, from);
      if (normal.lengthSq() < 1e-6) normal.set(0, 0, 1);
      normal.normalize();
      return {
        id: r.id,
        worldPos: positions[i],
        normal,
        radius: r.radius,
        finish: Boolean(r.finish),
      };
    });
  }, []);

  const timeoutFired = useRef(false);
  const prevStatus = useRef(race.status);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    if (useDroneStore.getState().phase !== "flight") return;

    if (prevStatus.current !== race.status && race.status === "running") {
      timeoutFired.current = false;
    }
    prevStatus.current = race.status;

    if (race.status !== "running") return;

    race.elapsed += dt;
    if (race.elapsed >= RACE_TIME_LIMIT && !timeoutFired.current) {
      timeoutFired.current = true;
      race.elapsed = RACE_TIME_LIMIT;
      race.status = "failed";
      useDroneStore.getState().setRaceStatus("failed");
      engineAudio.playTimeout();
      return;
    }

    for (const ring of rings) {
      tmpToDrone.subVectors(flight.pos, ring.worldPos);
      const alongAxis = tmpToDrone.dot(ring.normal);
      if (Math.abs(alongAxis) > CROSS_EPSILON) continue;
      tmpPerp.copy(tmpToDrone).addScaledVector(ring.normal, -alongAxis);
      if (tmpPerp.length() > ring.radius) continue;
      handleCrossing(ring);
    }
  });

  return null;
}

function handleCrossing(ring: RingRuntime) {
  if (race.passedIds.has(ring.id)) return;
  race.passedIds.add(ring.id);
  race.ringsPassed += 1;

  if (ring.finish) {
    const timeBonus = Math.max(0, Math.round((RACE_TIME_LIMIT - race.elapsed) * 10));
    race.score += RACE_FINISH_POINTS + timeBonus;
    race.status = "finished";
    useDroneStore.getState().setRaceStatus("finished");
    engineAudio.playArpeggio();
  } else {
    race.score += RACE_CHECKPOINT_POINTS;
    engineAudio.playCollect();
  }
}

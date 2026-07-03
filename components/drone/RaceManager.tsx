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
import { flight, race, resetRace, useDroneStore } from "./store";
import { engineAudio } from "@/lib/drone/audio";

// How far (world units, along the ring's facing axis) the drone can be from
// the ring's plane and still count as "passing through" it. Generous enough
// that a single frame at top speed can't skip past undetected.
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

/** No visual output — precomputes each ring's world position/orientation
 *  once, then checks every frame whether the drone just flew through one.
 *  Sibling to InteractionManager, but for the ring challenge rather than
 *  boards/signposts. */
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

  const firstRingId = RACE_RINGS[0].id;
  const timeoutFired = useRef(false);
  // Seconds since the run last transitioned to failed/finished. Starts high
  // so the very first-ever pass of ring 1 isn't blocked; guards against the
  // drone still sitting inside ring 1's zone the instant a run ends (e.g.
  // timing out while looping back near the start) instantly restarting
  // before the results screen has a chance to show.
  const sinceEnd = useRef(Infinity);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    if (useDroneStore.getState().phase !== "flight") return;

    if (race.status === "running") {
      race.elapsed += dt;
      if (race.elapsed >= RACE_TIME_LIMIT && !timeoutFired.current) {
        timeoutFired.current = true;
        race.elapsed = RACE_TIME_LIMIT;
        race.status = "failed";
        sinceEnd.current = 0;
        useDroneStore.getState().setRaceStatus("failed");
        engineAudio.playTimeout();
      }
    } else {
      sinceEnd.current += dt;
    }

    for (const ring of rings) {
      tmpToDrone.subVectors(flight.pos, ring.worldPos);
      const alongAxis = tmpToDrone.dot(ring.normal);
      if (Math.abs(alongAxis) > CROSS_EPSILON) continue;
      tmpPerp.copy(tmpToDrone).addScaledVector(ring.normal, -alongAxis);
      if (tmpPerp.length() > ring.radius) continue;
      handleCrossing(ring, firstRingId, timeoutFired, sinceEnd);
    }
  });

  return null;
}

function handleCrossing(
  ring: RingRuntime,
  firstRingId: string,
  timeoutFired: React.MutableRefObject<boolean>,
  sinceEnd: React.MutableRefObject<number>
) {
  const isRestart =
    ring.id === firstRingId && race.status !== "running" && sinceEnd.current > 0.8;
  if (isRestart) {
    resetRace();
    timeoutFired.current = false;
    sinceEnd.current = Infinity;
    race.status = "running";
    race.passedIds.add(ring.id);
    race.ringsPassed = 1;
    race.score = RACE_CHECKPOINT_POINTS;
    useDroneStore.getState().setRaceStatus("running");
    engineAudio.playCollect();
    return;
  }

  if (race.status !== "running" || race.passedIds.has(ring.id)) return;
  race.passedIds.add(ring.id);
  race.ringsPassed += 1;

  if (ring.finish) {
    const timeBonus = Math.max(0, Math.round((RACE_TIME_LIMIT - race.elapsed) * 10));
    race.score += RACE_FINISH_POINTS + timeBonus;
    race.status = "finished";
    sinceEnd.current = 0;
    useDroneStore.getState().setRaceStatus("finished");
    engineAudio.playArpeggio();
  } else {
    race.score += RACE_CHECKPOINT_POINTS;
    engineAudio.playCollect();
  }
}

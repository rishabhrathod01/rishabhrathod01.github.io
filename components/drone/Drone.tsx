"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { flight, keys, useDroneStore } from "./store";
import { engineAudio } from "@/lib/drone/audio";
import { heightAt, getWorldData } from "@/lib/drone/terrain";
import { WORLD, SPAWN } from "@/lib/drone/layout";
import type { FlightPhase } from "./types";
import DroneModel from "./DroneModel";

// Where the drone sits in idle mode: projected onto the hero anchor rect,
// on a plane close to the camera so the model fills the anchor.
export const IDLE_CAM = new THREE.Vector3(0, 3.2, 12);
export const IDLE_PLANE_Z = 8;
const FOV = 65;

const LAUNCH_DURATION = 2.6;

// Flight constants — ported verbatim from the original implementation.
const BASE_SPEED = 0.15;
const FWD_FACTOR = 60;
const STRAFE_FACTOR = 45;
const VERT_FACTOR = 35;
const SPORT_MULTIPLIER = 1.8;
const VEL_LERP = 3.5;
const TILT_AMOUNT = 0.25;
const ROLL_AMOUNT = 0.35;
const TILT_LERP = 5;
const YAW_SPEED = 1.8;
const YAW_LERP = 4;
const YAW_BANK = 0.18;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Drone({
  anchorRef,
}: {
  anchorRef: RefObject<HTMLDivElement | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const phase = useDroneStore((s) => s.phase);
  const setPhase = useDroneStore((s) => s.setPhase);
  const size = useThree((s) => s.size);

  const launch = useRef({ t: 0, from: new THREE.Vector3(), active: false });
  const anchorTarget = useRef(new THREE.Vector3(2.5, 3.2, IDLE_PLANE_Z));
  /** Viewport px center captured once per idle session — scroll must not move the drone. */
  const idleScreenPos = useRef<{ cx: number; cy: number } | null>(null);
  const prevPhase = useRef<FlightPhase>("idle");
  const snapped = useRef(false);
  const crashCooldown = useRef(0);
  const spawnPos = useMemo(
    () =>
      new THREE.Vector3(
        SPAWN.x,
        heightAt(SPAWN.x, SPAWN.z) + SPAWN.hover + 3.8,
        SPAWN.z
      ),
    []
  );

  useEffect(() => {
    if (group.current) group.current.rotation.order = "YXZ";
  }, []);

  // Reset the launch timer whenever we enter `launching`.
  useEffect(() => {
    if (phase === "launching" && group.current) {
      launch.current.t = 0;
      launch.current.from.copy(group.current.position);
      launch.current.active = true;
    }
  }, [phase]);

  // Re-snap idle hover when returning to the hero after flight (not on scroll).
  useEffect(() => {
    if (phase === "idle" && prevPhase.current !== "idle") {
      idleScreenPos.current = null;
      snapped.current = false;
    }
    prevPhase.current = phase;
  }, [phase]);

  useEffect(() => {
    const onResize = () => {
      const ph = useDroneStore.getState().phase;
      if (ph === "idle" || ph === "charging") {
        idleScreenPos.current = null;
        snapped.current = false;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    if (phase === "idle" || phase === "charging") {
      // --- Anchor projection: lock to the hero viewport slot once captured ---
      const rect = anchorRef.current?.getBoundingClientRect();
      const target = anchorTarget.current;
      if (rect && !idleScreenPos.current) {
        idleScreenPos.current = {
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
        };
      }
      const screen = idleScreenPos.current;
      if (screen) {
        const ndcX = (screen.cx / size.width) * 2 - 1;
        const ndcY = 1 - (screen.cy / size.height) * 2;
        const dist = IDLE_CAM.z - IDLE_PLANE_Z;
        const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * dist;
        const halfW = halfH * (size.width / size.height);
        target.set(
          IDLE_CAM.x + ndcX * halfW,
          IDLE_CAM.y + ndcY * halfH,
          IDLE_PLANE_Z
        );
      }
      const bobY = Math.sin(t * 1.2) * 0.12;
      if (!snapped.current) {
        g.position.set(target.x, target.y + bobY, target.z);
        snapped.current = true;
      } else {
        g.position.x = THREE.MathUtils.lerp(g.position.x, target.x, dt * 4);
        g.position.y = THREE.MathUtils.lerp(g.position.y, target.y + bobY, dt * 4);
        g.position.z = THREE.MathUtils.lerp(g.position.z, target.z, dt * 4);
      }
      // Gentle sway — the mesh-level PI flip keeps the gimbal toward the user.
      g.rotation.y = Math.sin(t * 0.3) * 0.12;
      g.rotation.x = THREE.MathUtils.lerp(
        g.rotation.x,
        phase === "charging" ? -0.06 : 0,
        dt * 4
      );
      g.rotation.z = 0;
      flight.propSpin =
        phase === "charging" ? 0.15 + flight.charge * 0.65 : 0.15;
      if (phase === "charging") {
        engineAudio.setHum(flight.charge * 0.7);
        engineAudio.setThrottle(flight.charge * 0.8);
      }
      flight.pos.copy(g.position);
      return;
    }

    if (phase === "launching") {
      // --- Takeoff choreography: eased arc from the hero to the pad sky ---
      launch.current.t += dt;
      const e = Math.min(launch.current.t / LAUNCH_DURATION, 1);
      const k = easeInOutCubic(e);
      g.position.lerpVectors(launch.current.from, spawnPos, k);
      g.position.y += Math.sin(k * Math.PI) * 2.2; // rise over the arc
      // DJI mannerism: small nose-dip as it commits to the climb.
      g.rotation.x = Math.sin(k * Math.PI) * -0.14;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, k);
      g.rotation.z = 0;
      flight.propSpin = Math.min(1, 0.15 + e * 1.6);
      engineAudio.setHum(Math.min(1, 0.3 + e));
      engineAudio.setThrottle(0.8 + e * 1.2);
      flight.pos.copy(g.position);
      if (e >= 1) {
        flight.pos.copy(spawnPos);
        flight.vel.set(0, 0, 0);
        flight.heading = 0;
        setPhase("flight");
      }
      return;
    }

    if (phase === "focus" || phase === "landing") {
      // Auto-hover in place; props idle fast.
      flight.propSpin = THREE.MathUtils.lerp(flight.propSpin, 0.45, dt * 3);
      g.position.set(
        flight.pos.x,
        flight.pos.y + Math.sin(t * 1.4) * 0.06,
        flight.pos.z
      );
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, dt * 4);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, flight.heading, dt * 4);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, dt * 4);
      engineAudio.setHum(0.5);
      engineAudio.setThrottle(0.3);
      return;
    }

    // ---------------------------------------------------------------------
    // phase === "flight": full physics
    // ---------------------------------------------------------------------
    const throttleF = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0);
    const throttleS = (keys.strafeRight ? 1 : 0) - (keys.strafeLeft ? 1 : 0);
    const throttleY = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
    const yawInput = (keys.yawLeft ? 1 : 0) - (keys.yawRight ? 1 : 0);
    flight.sport = keys.sport;

    const speedMul = flight.sport ? SPORT_MULTIPLIER : 1;
    const tvF = throttleF * BASE_SPEED * FWD_FACTOR * speedMul;
    const tvS = throttleS * BASE_SPEED * STRAFE_FACTOR * speedMul;
    const tvY = throttleY * BASE_SPEED * VERT_FACTOR * speedMul;

    // Yaw with its own inertia; banked turns fall out of the roll math below.
    flight.yawRate = THREE.MathUtils.lerp(
      flight.yawRate,
      yawInput * YAW_SPEED,
      dt * YAW_LERP
    );
    flight.heading += flight.yawRate * dt;

    // Local-frame throttle rotated into world space (heading 0 = -Z).
    const h = flight.heading;
    const fwdX = -Math.sin(h);
    const fwdZ = -Math.cos(h);
    const rightX = Math.cos(h);
    const rightZ = -Math.sin(h);

    const vel = flight.vel;
    vel.x = THREE.MathUtils.lerp(vel.x, fwdX * tvF + rightX * tvS, dt * VEL_LERP);
    vel.z = THREE.MathUtils.lerp(vel.z, fwdZ * tvF + rightZ * tvS, dt * VEL_LERP);
    vel.y = THREE.MathUtils.lerp(vel.y, tvY, dt * VEL_LERP);

    const pos = flight.pos;
    pos.addScaledVector(vel, dt);

    // --- Geofence: soft inward push past the soft radius (DJI-style) ---
    const r = Math.hypot(pos.x, pos.z);
    if (r > WORLD.softRadius) {
      const inward = -(r - WORLD.softRadius) * 2.2;
      vel.x += (pos.x / r) * inward * dt * 10;
      vel.z += (pos.z / r) * inward * dt * 10;
      flight.geofence = true;
    } else {
      flight.geofence = false;
    }
    if (r > WORLD.hardRadius) {
      const s = WORLD.hardRadius / r;
      pos.x *= s;
      pos.z *= s;
    }

    // --- Terrain clamp (heightAt is the collision engine) ---
    const ground = heightAt(pos.x, pos.z);
    const minY = ground + 0.8;
    if (pos.y < minY) {
      if (vel.y < -6 && crashCooldown.current <= 0) {
        engineAudio.playCrash();
        flight.shake = 0.4;
        crashCooldown.current = 0.8;
      }
      pos.y = minY;
      if (vel.y < 0) vel.y = 0;
    }
    pos.y = Math.min(pos.y, WORLD.maxAltitude);

    // --- Obstacle cylinders (trees/rocks/posts), brute-force 2D ---
    crashCooldown.current -= dt;
    const { colliders } = getWorldData();
    for (const c of colliders) {
      if (pos.y > c.top) continue;
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const rr = c.r + 0.45;
      const d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const nz = dz / d;
        pos.x = c.x + nx * rr;
        pos.z = c.z + nz * rr;
        const vdotn = vel.x * nx + vel.z * nz;
        if (vdotn < 0) {
          // reflect and damp — a soft bounce, no damage
          vel.x = (vel.x - 2 * vdotn * nx) * 0.45;
          vel.z = (vel.z - 2 * vdotn * nz) * 0.45;
          if (Math.abs(vdotn) > 3 && crashCooldown.current <= 0) {
            engineAudio.playCrash();
            flight.shake = 0.3;
            crashCooldown.current = 0.8;
          }
        }
      }
    }

    // --- Aerodynamic tilts + banked turns ---
    const targetPitch = -throttleF * TILT_AMOUNT;
    const targetRoll = -throttleS * ROLL_AMOUNT + flight.yawRate * YAW_BANK;
    flight.pitch = THREE.MathUtils.lerp(flight.pitch, targetPitch, dt * TILT_LERP);
    flight.roll = THREE.MathUtils.lerp(flight.roll, targetRoll, dt * TILT_LERP);

    g.position.copy(pos);
    g.rotation.set(flight.pitch, flight.heading, flight.roll);

    // --- Telemetry + prop spin + audio ---
    const speed = vel.length();
    flight.speedKmh = speed * 3.6;
    flight.altitude = Math.max(pos.y - ground, 0);
    flight.propSpin = Math.min(1, 0.55 + speed / 25);
    flight.throttleTotal =
      Math.abs(throttleF) + Math.abs(throttleS) + Math.abs(throttleY) +
      Math.abs(yawInput) * 0.5;
    engineAudio.setHum(1);
    engineAudio.setThrottle(flight.throttleTotal * (flight.sport ? 1.4 : 1));
  });

  return (
    <group ref={group}>
      <DroneModel />
    </group>
  );
}

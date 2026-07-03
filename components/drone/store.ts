"use client";

import { create } from "zustand";
import * as THREE from "three";
import type { FlightPhase, Interactable } from "./types";

// ---------------------------------------------------------------------------
// Per-frame mutable flight state. Lives OUTSIDE React — physics, camera and
// HUD write/read it every frame without triggering renders.

export const flight = {
  pos: new THREE.Vector3(0, 2, 0),
  vel: new THREE.Vector3(),
  /** Yaw heading in radians; 0 = facing north (−Z). */
  heading: 0,
  yawRate: 0,
  pitch: 0,
  roll: 0,
  throttleTotal: 0,
  sport: false,
  /** Visual prop spin, 0..1 (idle ≈ 0.15, flight = 1). */
  propSpin: 0.15,
  /** Long-press charge, 0..1. */
  charge: 0,
  /** Camera shake impulse, decays per frame. */
  shake: 0,
  speedKmh: 0,
  altitude: 0,
  /** Geofence overshoot warning flag, read by HUD. */
  geofence: false,
  /** Time of day: 0 = morning at takeoff → 1 = sunset after a long flight. */
  dayT: 0,
  /** Idle-mode 2D screen position (px) — the drone lives in the viewport,
      independent of page scroll, and is steerable until takeoff. */
  screenX: 0,
  screenY: 0,
  screenVX: 0,
  screenVY: 0,
  idleInit: false,
};

export function resetFlight() {
  flight.pos.set(0, 2, 0);
  flight.vel.set(0, 0, 0);
  flight.heading = 0;
  flight.yawRate = 0;
  flight.pitch = 0;
  flight.roll = 0;
  flight.throttleTotal = 0;
  flight.sport = false;
  flight.propSpin = 0.15;
  flight.charge = 0;
  flight.shake = 0;
  flight.geofence = false;
  flight.dayT = 0;
  flight.screenVX = 0;
  flight.screenVY = 0;
  flight.idleInit = false; // re-snap to the hero anchor on next idle frame
  resetRace();
}

// ---------------------------------------------------------------------------
// Ring-flying time trial. Mutable per-frame state (checked every frame by
// RaceManager) plus a low-frequency zustand mirror (`raceStatus`) for the
// HUD/results overlay, which only needs to re-render on status transitions.

export type RaceStatus = "idle" | "running" | "finished" | "failed";

export const race = {
  status: "idle" as RaceStatus,
  elapsed: 0,
  score: 0,
  ringsPassed: 0,
  passedIds: new Set<string>(),
};

export function resetRace() {
  race.status = "idle";
  race.elapsed = 0;
  race.score = 0;
  race.ringsPassed = 0;
  race.passedIds.clear();
}

/** Begin a ring run after the pilot confirms on the briefing board (Enter). */
export function startRace() {
  resetRace();
  race.status = "running";
  useDroneStore.getState().setRaceStatus("running");
}

/** Raw key state, written by useFlightControls, read by physics. */
export const keys = {
  forward: false,
  back: false,
  yawLeft: false,
  yawRight: false,
  strafeLeft: false,
  strafeRight: false,
  up: false,
  down: false,
  sport: false,
};

export function resetKeys() {
  (Object.keys(keys) as (keyof typeof keys)[]).forEach((k) => (keys[k] = false));
}

// ---------------------------------------------------------------------------
// React-visible state (low-frequency updates only).

const SESSION_KEY = "drone-flight-v1";

interface SessionState {
  cells: string[];
  pos?: [number, number, number];
  heading?: number;
  inFlight?: boolean;
}

export function saveSession(state: SessionState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* private mode etc. — non-essential */
  }
}

export function loadSession(): SessionState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    return null;
  }
}

interface DroneStore {
  phase: FlightPhase;
  setPhase: (phase: FlightPhase) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  /** Collected battery cell ids. */
  cells: string[];
  collectCell: (id: string) => void;
  /** Nearest in-range interactable (updated ~10 Hz, not per frame). */
  nearest: Interactable | null;
  setNearest: (i: Interactable | null) => void;
  /** Board currently opened in focus mode. */
  focus: Interactable | null;
  setFocus: (i: Interactable | null) => void;
  /** Mirrors `race.status` — only updated on transitions, so subscribing to
      it doesn't re-render every frame the way polling `race` would. */
  raceStatus: RaceStatus;
  setRaceStatus: (status: RaceStatus) => void;
  /** True when the drone is in range of the ring-challenge briefing board. */
  raceBoardNearby: boolean;
  setRaceBoardNearby: (nearby: boolean) => void;
}

export const useDroneStore = create<DroneStore>((set, get) => ({
  phase: "idle",
  setPhase: (phase) => set({ phase }),
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  cells: [],
  collectCell: (id) => {
    if (get().cells.includes(id)) return;
    const cells = [...get().cells, id];
    set({ cells });
    saveSession({
      cells,
      pos: [flight.pos.x, flight.pos.y, flight.pos.z],
      heading: flight.heading,
    });
  },
  nearest: null,
  setNearest: (nearest) => {
    if (get().nearest?.id !== nearest?.id) set({ nearest });
  },
  focus: null,
  setFocus: (focus) => set({ focus }),
  raceStatus: "idle",
  setRaceStatus: (raceStatus) => set({ raceStatus }),
  raceBoardNearby: false,
  setRaceBoardNearby: (raceBoardNearby) => set({ raceBoardNearby }),
}));

// ---------------------------------------------------------------------------
// Interactable registry: boards/signposts/cells register themselves; the
// InteractionManager brute-force checks distances per frame.

export const interactables = new Map<string, Interactable>();

// Debug handle (dev only): lets us inspect phase/charge from the console.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as Record<string, unknown>).__drone = { useDroneStore, flight, keys, interactables, race };
}

export function registerInteractable(item: Interactable): () => void {
  interactables.set(item.id, item);
  return () => {
    interactables.delete(item.id);
  };
}

// Hero CTA and other UI can request takeoff without reaching into DroneExperience.
let takeoffRequestHandler: (() => void) | null = null;

export function setTakeoffRequestHandler(handler: (() => void) | null) {
  takeoffRequestHandler = handler;
}

export function requestTakeoff() {
  takeoffRequestHandler?.();
}

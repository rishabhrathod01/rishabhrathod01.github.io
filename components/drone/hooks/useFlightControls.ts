"use client";

import { useEffect } from "react";
import { keys, resetKeys, useDroneStore } from "../store";
import { engineAudio } from "@/lib/drone/audio";

// Flight scheme: W/S ascend/descend, A/D yaw, arrows fly (fwd/back/strafe),
// Space/C also vertical, Shift = sport mode.
const FLIGHT_MAP: Record<string, keyof typeof keys> = {
  KeyW: "up",
  KeyS: "down",
  KeyA: "yawLeft",
  KeyD: "yawRight",
  ArrowUp: "forward",
  ArrowDown: "back",
  ArrowLeft: "strafeLeft",
  ArrowRight: "strafeRight",
  Space: "up",
  KeyC: "down",
  ControlLeft: "down",
  ControlRight: "down",
  ShiftLeft: "sport",
  ShiftRight: "sport",
};

// Idle scheme: simple 2D steering of the hero drone around the viewport.
// Deliberately excludes Space/Shift/Ctrl so normal page shortcuts survive.
const IDLE_MAP: Record<string, keyof typeof keys> = {
  KeyW: "forward",
  KeyS: "back",
  KeyA: "strafeLeft",
  KeyD: "strafeRight",
  ArrowUp: "forward",
  ArrowDown: "back",
  ArrowLeft: "strafeLeft",
  ArrowRight: "strafeRight",
};

export function useFlightControls() {
  const phase = useDroneStore((s) => s.phase);
  const mode =
    phase === "flight" ? "flight" : phase === "idle" || phase === "charging" ? "idle" : null;

  useEffect(() => {
    if (!mode) {
      resetKeys();
      return;
    }
    const map = mode === "flight" ? FLIGHT_MAP : IDLE_MAP;
    const down = (e: KeyboardEvent) => {
      const key = map[e.code];
      if (!key) return;
      // Arrows/Space would otherwise scroll the page under the drone.
      e.preventDefault();
      // A movement key is a valid gesture — lets the idle hover hum start.
      if (mode === "idle") engineAudio.init();
      keys[key] = true;
    };
    const up = (e: KeyboardEvent) => {
      const key = map[e.code];
      if (!key) return;
      keys[key] = false;
    };
    const blur = () => resetKeys();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      resetKeys();
    };
  }, [mode]);
}

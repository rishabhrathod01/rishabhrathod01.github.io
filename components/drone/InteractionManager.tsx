"use client";

import { useEffect } from "react";
import { flight, interactables, useDroneStore, saveSession } from "./store";
import { engineAudio } from "@/lib/drone/audio";
import { getFocusLink } from "@/lib/drone/focus-links";
import type { FlightContent } from "./types";

// Proximity + key handling (E = read/resume, Enter = nav + focus links). Runs at 10 Hz
// speed (~16 m/s) the drone moves 1.6 m per tick, well inside the 5–7 m
// trigger radii. No per-frame React work.
export default function InteractionManager({
  onNavigate,
  content,
}: {
  onNavigate: (href: string) => void;
  content: FlightContent;
}) {
  useEffect(() => {
    const iv = setInterval(() => {
      const st = useDroneStore.getState();
      if (st.phase !== "flight") {
        if (st.nearest) st.setNearest(null);
        return;
      }
      const p = flight.pos;
      let best = null;
      let bestD = Infinity;
      for (const it of Array.from(interactables.values())) {
        const dx = p.x - it.position[0];
        const dy = p.y - it.position[1];
        const dz = p.z - it.position[2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (it.kind === "collect") {
          if (d2 < it.radius * it.radius) {
            st.collectCell(it.id);
            engineAudio.playCollect();
            if (useDroneStore.getState().cells.length === 8) {
              engineAudio.playArpeggio();
            }
          }
          continue;
        }
        if (d2 < it.radius * it.radius && d2 < bestD) {
          best = it;
          bestD = d2;
        }
      }
      st.setNearest(best);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const st = useDroneStore.getState();

      if (e.code === "KeyE") {
        e.preventDefault();
        if (st.phase === "focus") {
          st.setFocus(null);
          st.setPhase("flight");
          return;
        }
        if (st.phase !== "flight" || !st.nearest || st.nearest.kind !== "focus") return;
        st.setFocus(st.nearest);
        st.setPhase("focus");
        return;
      }

      if (e.code !== "Enter" && e.code !== "NumpadEnter") return;

      if (st.phase === "focus" && st.focus) {
        const href = getFocusLink(st.focus.id, content);
        if (!href) return;
        e.preventDefault();
        saveSession({
          cells: st.cells,
          pos: [flight.pos.x, flight.pos.y, flight.pos.z],
          heading: flight.heading,
          inFlight: true,
        });
        onNavigate(href);
        return;
      }

      if (st.phase !== "flight" || !st.nearest || st.nearest.kind !== "nav" || !st.nearest.href)
        return;
      e.preventDefault();
      saveSession({
        cells: st.cells,
        pos: [flight.pos.x, flight.pos.y, flight.pos.z],
        heading: flight.heading,
        inFlight: true,
      });
      onNavigate(st.nearest.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNavigate, content]);

  return null;
}

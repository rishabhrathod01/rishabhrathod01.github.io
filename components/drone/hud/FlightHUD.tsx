"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { flight, race, useDroneStore } from "../store";
import { RACE_RINGS, RACE_TIME_LIMIT } from "@/lib/drone/layout";
import ControlLegend from "./ControlLegend";

// DJI-style telemetry, restyled to Kinetic Obsidian. Values are flushed from
// the mutable flight state into the DOM at 10 Hz via refs — no per-frame
// React renders.
export default function FlightHUD() {
  const nearest = useDroneStore((s) => s.nearest);
  const cells = useDroneStore((s) => s.cells);
  const soundEnabled = useDroneStore((s) => s.soundEnabled);
  const toggleSound = useDroneStore((s) => s.toggleSound);
  const phase = useDroneStore((s) => s.phase);

  const speedRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [sport, setSport] = useState(false);
  const [geofence, setGeofence] = useState(false);
  const [raceRingsPassed, setRaceRingsPassed] = useState(0);
  const [raceScore, setRaceScore] = useState(0);
  const raceStatus = useDroneStore((s) => s.raceStatus);
  const raceBoardNearby = useDroneStore((s) => s.raceBoardNearby);

  useEffect(() => {
    const iv = setInterval(() => {
      if (speedRef.current)
        speedRef.current.textContent = flight.speedKmh.toFixed(0);
      if (altRef.current) altRef.current.textContent = flight.altitude.toFixed(1);
      if (timeRef.current)
        timeRef.current.textContent = Math.max(0, RACE_TIME_LIMIT - race.elapsed).toFixed(1);
      setSport(flight.sport);
      setGeofence(flight.geofence);
      setRaceRingsPassed(race.ringsPassed);
      setRaceScore(race.score);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  const inFlight = phase === "flight";
  const racing = raceStatus === "running";

  return (
    <div className="absolute inset-0 pointer-events-none font-jetbrains text-xs select-none">
      {/* Top bar */}
      <div className="absolute top-5 inset-x-0 flex items-start justify-between px-6">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full glass-card font-bold tracking-widest ${
                sport ? "text-emerald" : "text-primary"
              }`}
            >
              {sport ? "SPORT" : "NORMAL"}
            </span>
            <span className="px-3 py-1.5 rounded-full glass-card text-slate-muted tracking-wider hidden md:inline">
              DJI MINI 4 PRO
            </span>
          </div>

          <div className="glass-card rounded-xl px-4 py-2 flex gap-5">
            <div>
              <p className="text-slate-muted tracking-widest text-[10px]">SPEED</p>
              <p className="text-on-surface text-lg font-bold leading-tight">
                <span ref={speedRef}>0</span>
                <span className="text-[10px] text-slate-muted ml-1">KM/H</span>
              </p>
            </div>
            <div>
              <p className="text-slate-muted tracking-widest text-[10px]">ALT</p>
              <p className="text-on-surface text-lg font-bold leading-tight">
                <span ref={altRef}>0</span>
                <span className="text-[10px] text-slate-muted ml-1">M</span>
              </p>
            </div>
          </div>

          {racing && (
            <div className="glass-card rounded-xl px-4 py-2 flex gap-5 border border-gold/40">
              <div>
                <p className="text-gold tracking-widest text-[10px]">TIME</p>
                <p className="text-on-surface text-lg font-bold leading-tight">
                  <span ref={timeRef}>{RACE_TIME_LIMIT.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-muted ml-1">S</span>
                </p>
              </div>
              <div>
                <p className="text-gold tracking-widest text-[10px]">RING</p>
                <p className="text-on-surface text-lg font-bold leading-tight">
                  {raceRingsPassed}
                  <span className="text-[10px] text-slate-muted ml-1">/{RACE_RINGS.length}</span>
                </p>
              </div>
              <div>
                <p className="text-gold tracking-widest text-[10px]">SCORE</p>
                <p className="text-on-surface text-lg font-bold leading-tight">{raceScore}</p>
              </div>
            </div>
          )}
        </div>

        {geofence && (
          <span className="absolute left-1/2 top-5 -translate-x-1/2 px-4 py-1.5 rounded-full glass-card text-amber-400 font-bold tracking-widest animate-pulse">
            GEOFENCE — RETURNING TO FIELD
          </span>
        )}

        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="px-3 py-1.5 rounded-full glass-card text-emerald tracking-wider">
            CELLS {cells.length}/8
          </span>
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full glass-card transition-colors ${
              soundEnabled
                ? "text-primary hover:text-on-surface"
                : "text-slate-muted hover:text-on-surface"
            }`}
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" strokeWidth={2.25} />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={2.25} />
            )}
          </button>
          <span className="px-3 py-1.5 rounded-full glass-card text-slate-muted tracking-wider">
            ESC LAND
          </span>
        </div>
      </div>

      {/* Interaction prompt */}
      {inFlight && nearest && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center">
          <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-3 text-on-surface">
            <kbd className="px-2 py-0.5 rounded border border-white/25 bg-surface-container text-primary font-bold">
              {nearest.kind === "nav" ? "ENTER" : "E"}
            </kbd>
            <span className="tracking-wider">{nearest.label}</span>
          </div>
        </div>
      )}

      {/* Briefing board discoverability — only when near the challenge board */}
      {inFlight && !nearest && raceStatus !== "running" && raceBoardNearby && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center">
          <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2 text-gold tracking-wider">
            🏁 Press <kbd className="px-1.5 py-0.5 rounded border border-gold/30 text-primary font-bold">E</kbd> on the briefing board
          </div>
        </div>
      )}

      {/* Bottom-left controls */}
      {inFlight && (
        <div className="absolute bottom-6 left-6">
          <ControlLegend />
        </div>
      )}
    </div>
  );
}

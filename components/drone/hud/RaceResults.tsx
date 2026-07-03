"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { RACE_RINGS, RACE_TIME_LIMIT } from "@/lib/drone/layout";
import { race, resetRace, useDroneStore } from "../store";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${s.padStart(4, "0")}`;
}

/** Shown when a ring-challenge run ends — finished or timed out. Dismissing
 *  (or simply flying back through the gold ring 1) resets the run. */
export default function RaceResults() {
  const raceStatus = useDroneStore((s) => s.raceStatus);
  const [snapshot, setSnapshot] = useState({ rings: 0, score: 0, elapsed: 0 });

  const done = raceStatus === "finished" || raceStatus === "failed";

  useEffect(() => {
    if (done) {
      setSnapshot({ rings: race.ringsPassed, score: race.score, elapsed: race.elapsed });
    }
  }, [done]);

  if (!done) return null;

  const dismiss = () => {
    resetRace();
    useDroneStore.getState().setRaceStatus("idle");
  };

  const success = raceStatus === "finished";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="glass-card rounded-2xl p-8 w-[360px] pointer-events-auto backdrop-blur-xl bg-surface/85 text-center relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-slate-muted hover:text-on-surface transition-colors"
          aria-label="Dismiss results"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="font-jetbrains text-[10px] tracking-widest uppercase text-gold mb-2">
          {success ? "🏁 Ring Challenge" : "⏱ Ring Challenge"}
        </p>
        <h3 className="font-geist text-2xl font-bold text-on-surface mb-6">
          {success ? "Challenge Complete!" : "Time's Up"}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-xl py-3">
            <p className="text-slate-muted text-[10px] tracking-widest mb-1">RINGS</p>
            <p className="text-on-surface text-xl font-bold">
              {snapshot.rings}/{RACE_RINGS.length}
            </p>
          </div>
          <div className="glass-card rounded-xl py-3">
            <p className="text-slate-muted text-[10px] tracking-widest mb-1">TIME</p>
            <p className="text-on-surface text-xl font-bold">
              {formatTime(Math.min(snapshot.elapsed, RACE_TIME_LIMIT))}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl py-4 mb-6">
          <p className="text-slate-muted text-[10px] tracking-widest mb-1">SCORE</p>
          <p className="text-gold text-3xl font-bold font-jetbrains">{snapshot.score}</p>
        </div>

        <p className="text-slate-muted text-xs font-jetbrains tracking-wider">
          Return to the briefing board — <span className="text-gold">E</span> to read,{" "}
          <span className="text-gold">Enter</span> to try again
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Plane } from "@/components/icons";
import type { FlightContent } from "@/components/drone/types";
import { requestTakeoff, useDroneStore } from "@/components/drone/store";

// three.js stays out of every other route's chunk graph.
const DroneExperience = dynamic(
  () => import("@/components/drone/DroneExperience"),
  { ssr: false }
);

export default function FlyClient({
  flightContent,
}: {
  flightContent: FlightContent;
}) {
  const droneAnchorRef = useRef<HTMLDivElement>(null);
  // Don't even fetch the drone chunk on small screens.
  const [show3D, setShow3D] = useState<boolean | null>(null);
  const dronePhase = useDroneStore((s) => s.phase);

  useEffect(() => {
    setShow3D(window.innerWidth >= 768);
  }, []);

  return (
    // The scene is a night sky, so this page is always dark.
    <div className="dark -mt-[60px] bg-[#0c1324] text-on-surface">
      <section className="mx-auto grid min-h-dvh max-w-container-max items-center gap-12 px-4 pt-[60px] md:grid-cols-2 md:px-6">
        <div>
          <p className="eyebrow">DJI Mini 4 Pro · keyboard flight</p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            Fly through my portfolio.
          </h1>
          {show3D === false ? (
            <>
              <p className="mt-6 max-w-[480px] text-lg text-slate-muted">
                The flight needs a keyboard and a wider screen. Open this page
                on a laptop to fly.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-lg border border-line px-3 py-2 text-base font-semibold"
              >
                Back to home
              </Link>
            </>
          ) : (
            <>
              <p className="mt-6 max-w-[480px] text-lg text-slate-muted">
                An island built from my work, posts, and drone videos. Hold F
                or press the button to take off. WASD to fly, Esc to land.
              </p>
              <button
                type="button"
                onClick={() => requestTakeoff()}
                disabled={dronePhase !== "idle"}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98] disabled:opacity-60"
              >
                Take flight <Plane className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {/* Idle drone hovers in this slot until takeoff. */}
        <div
          ref={droneAnchorRef}
          className="hidden h-[320px] md:block"
          aria-hidden
        />
      </section>

      {show3D && (
        <DroneExperience content={flightContent} anchorRef={droneAnchorRef} />
      )}
    </div>
  );
}

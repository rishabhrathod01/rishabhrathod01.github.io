"use client";

// NOTE: requires @react-three/fiber@9 / @react-three/drei@10 and React 19.
// Next 15's App Router runs its vendored React 19 regardless of package.json,
// so fiber 8 (React-18 internals) crashes at runtime — don't downgrade.

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { FlightContent } from "./types";
import {
  flight,
  resetFlight,
  loadSession,
  saveSession,
  useDroneStore,
  setTakeoffRequestHandler,
} from "./store";
import { engineAudio } from "@/lib/drone/audio";
import Drone from "./Drone";
import ChaseCamera from "./ChaseCamera";
import Lighting from "./Lighting";
import InteractionManager from "./InteractionManager";
import TakeoffPrompt from "./hud/TakeoffPrompt";
import IdleInteractionLayer from "./hud/IdleInteractionLayer";
import FlightHUD from "./hud/FlightHUD";
import FocusPanel from "./hud/FocusPanel";
import RaceResults from "./hud/RaceResults";
import { useFlightControls } from "./hooks/useFlightControls";

const FlightScene = lazy(() => import("./FlightScene"));

const CHARGE_SECONDS = 1.1;

export interface DroneExperienceProps {
  content: FlightContent;
  anchorRef: RefObject<HTMLDivElement | null>;
}

export default function DroneExperience({
  content,
  anchorRef,
}: DroneExperienceProps) {
  const router = useRouter();
  const phase = useDroneStore((s) => s.phase);
  const setPhase = useDroneStore((s) => s.setPhase);
  const soundEnabled = useDroneStore((s) => s.soundEnabled);
  const volume = useDroneStore((s) => s.volume);

  const [canFly, setCanFly] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [worldMounted, setWorldMounted] = useState(false);
  const [shutter, setShutter] = useState(false);
  const [frameActive, setFrameActive] = useState(true);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 2]);

  const chargeRaf = useRef(0);

  // WASD/arrow/space key state for the physics loop.
  useFlightControls();

  // --- Capability gate: keyboard flight needs a fine pointer + room ---
  useEffect(() => {
    setCanFly(
      window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768
    );
  }, []);

  // --- Session restore: collected cells always; resume flight after a
  //     signpost navigation brought the user back (back button). ---
  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    if (s.cells?.length) useDroneStore.setState({ cells: s.cells });
    if (s.inFlight && s.pos) {
      flight.pos.set(s.pos[0], s.pos[1], s.pos[2]);
      flight.heading = s.heading ?? 0;
      setWorldMounted(true);
      setPhase("flight");
      saveSession({ ...s, inFlight: false }); // consume — refresh lands normally
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Long-press charge machine ---
  const beginCharge = useCallback(() => {
    const st = useDroneStore.getState();
    if (st.phase !== "idle" || !canFly) return;
    engineAudio.init(); // valid user gesture
    setWorldMounted(true); // warm the lazy world chunk during the hold
    st.setPhase("charging");
    cancelAnimationFrame(chargeRaf.current);
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      flight.charge = Math.min(1, flight.charge + dt / CHARGE_SECONDS);
      if (flight.charge >= 1) {
        useDroneStore.getState().setPhase("launching");
        return;
      }
      chargeRaf.current = requestAnimationFrame(step);
    };
    chargeRaf.current = requestAnimationFrame(step);
  }, [canFly]);

  const cancelCharge = useCallback(() => {
    if (useDroneStore.getState().phase !== "charging") return;
    cancelAnimationFrame(chargeRaf.current);
    let last = performance.now();
    const decay = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      flight.charge = Math.max(0, flight.charge - dt * 2);
      if (flight.charge <= 0) {
        engineAudio.setHum(0);
        useDroneStore.getState().setPhase("idle");
        return;
      }
      chargeRaf.current = requestAnimationFrame(decay);
    };
    chargeRaf.current = requestAnimationFrame(decay);
  }, []);

  // F key hold (anchor hover not required — the tooltip teaches it).
  useEffect(() => {
    if (!canFly) return;
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyF" && !e.repeat) beginCharge();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyF") cancelCharge();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [canFly, beginCharge, cancelCharge]);

  useEffect(() => {
    setTakeoffRequestHandler(beginCharge);
    return () => setTakeoffRequestHandler(null);
  }, [beginCharge]);

  // --- Landing (Esc) ---
  const beginLanding = useCallback(() => {
    if (useDroneStore.getState().phase !== "flight") return;
    const st = useDroneStore.getState();
    saveSession({ cells: st.cells, inFlight: false });
    st.setPhase("landing");
    setShutter(true);
    setTimeout(() => {
      resetFlight();
      engineAudio.setHum(0);
      useDroneStore.getState().setNearest(null);
      useDroneStore.getState().setPhase("idle");
      setTimeout(() => setShutter(false), 120);
    }, 380);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const st = useDroneStore.getState();
      if (st.focus) {
        st.setFocus(null);
        st.setPhase("flight");
        return;
      }
      if (st.phase === "flight") beginLanding();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beginLanding]);

  // --- Nav signpost navigation: shutter, then route ---
  const handleNavigate = useCallback(
    (href: string) => {
      setShutter(true);
      engineAudio.setHum(0);
      setTimeout(() => router.push(href), 320);
    },
    [router]
  );

  // --- Scroll lock while flying ---
  useEffect(() => {
    const lock = phase !== "idle" && phase !== "charging";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // --- Frameloop + audio gating: keep idle drone live on desktop ---
  useEffect(() => {
    const update = () => {
      const ph = useDroneStore.getState().phase;
      setFrameActive(!document.hidden && (ph !== "idle" || canFly));
    };
    const onVis = () => {
      if (document.hidden) engineAudio.suspend();
      else engineAudio.resume();
      update();
    };
    document.addEventListener("visibilitychange", onVis);
    const unsub = useDroneStore.subscribe(update);
    update();
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      unsub();
    };
  }, [canFly]);

  useEffect(() => {
    engineAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    engineAudio.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => () => engineAudio.dispose(), []);

  const inWorld =
    phase === "launching" ||
    phase === "flight" ||
    phase === "focus" ||
    phase === "landing";

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Backdrop behind the canvas: hides the page once we're in the world.
          Shares #0c1324 with the page + sky zenith, so every fade is seamless. */}
      <div
        className="absolute inset-0 bg-surface transition-opacity duration-700"
        style={{ opacity: inWorld ? 1 : 0 }}
      />

      <Canvas
        className="absolute inset-0"
        camera={{ fov: 65, near: 0.1, far: 260, position: [0, 3.2, 12] }}
        dpr={dpr}
        frameloop={frameActive ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMappingExposure: 1.15,
        }}
        style={{ pointerEvents: "none" }}
      >
        {/* Degrade resolution before dropping frames on weaker GPUs. */}
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr([1, 2])}
        />
        <Lighting />
        <Drone anchorRef={anchorRef} />
        <ChaseCamera />
        {worldMounted && (
          <Suspense fallback={null}>
            <FlightScene content={content} />
          </Suspense>
        )}
      </Canvas>

      {/* DOM overlays */}
      {canFly && (phase === "idle" || phase === "charging") && (
        <IdleInteractionLayer
          onHover={setHovered}
          onChargeStart={beginCharge}
          onChargeEnd={cancelCharge}
        />
      )}
      <TakeoffPrompt
        visible={
          canFly &&
          (hovered || phase === "charging") &&
          (phase === "idle" || phase === "charging")
        }
      />
      {(phase === "flight" || phase === "focus") && <FlightHUD />}
      {(phase === "flight" || phase === "focus") && <RaceResults />}
      {phase === "focus" && (
        <FocusPanel content={content} onNavigate={handleNavigate} />
      )}
      {inWorld && (
        <InteractionManager onNavigate={handleNavigate} content={content} />
      )}

      {/* Shutter above everything: landing + page-navigation cuts. */}
      <div
        className="absolute inset-0 bg-surface transition-opacity duration-300"
        style={{ opacity: shutter ? 1 : 0 }}
      />
    </div>
  );
}

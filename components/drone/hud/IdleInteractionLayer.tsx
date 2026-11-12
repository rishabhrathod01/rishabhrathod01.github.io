"use client";

import { useEffect, useRef } from "react";
import { flight } from "../store";

const HIT_W = 260;
const HIT_H = 180;

/** Viewport-fixed hover/click target that tracks the idle drone screen position. */
export default function IdleInteractionLayer({
  onChargeStart,
  onChargeEnd,
}: {
  onChargeStart: () => void;
  onChargeEnd: () => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", "Fly the drone: hold F, or press and hold here");

    const pointerDown = (e: PointerEvent) => {
      e.preventDefault();
      onChargeStart();
    };

    el.addEventListener("pointerleave", onChargeEnd);
    el.addEventListener("pointerdown", pointerDown);
    el.addEventListener("pointerup", onChargeEnd);
    el.addEventListener("blur", onChargeEnd);

    return () => {
      el.removeEventListener("pointerleave", onChargeEnd);
      el.removeEventListener("pointerdown", pointerDown);
      el.removeEventListener("pointerup", onChargeEnd);
      el.removeEventListener("blur", onChargeEnd);
    };
  }, [onChargeStart, onChargeEnd]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = layerRef.current;
      if (el && flight.idleInit) {
        el.style.left = `${flight.screenX}px`;
        el.style.top = `${flight.screenY}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={layerRef}
      className="fixed z-[59] cursor-pointer pointer-events-auto"
      style={{
        width: HIT_W,
        height: HIT_H,
        transform: "translate(-50%, -50%)",
        left: 0,
        top: 0,
      }}
    />
  );
}

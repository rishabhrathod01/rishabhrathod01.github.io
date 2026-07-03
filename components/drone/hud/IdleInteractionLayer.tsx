"use client";

import { useEffect, useRef } from "react";
import { flight } from "../store";

const HIT_W = 260;
const HIT_H = 180;

/** Viewport-fixed hover/click target that tracks the idle drone screen position. */
export default function IdleInteractionLayer({
  onHover,
  onChargeStart,
  onChargeEnd,
}: {
  onHover: (hovered: boolean) => void;
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

    const enter = () => onHover(true);
    const leave = () => {
      onHover(false);
      onChargeEnd();
    };
    const pointerDown = (e: PointerEvent) => {
      e.preventDefault();
      onChargeStart();
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", pointerDown);
    el.addEventListener("pointerup", onChargeEnd);
    el.addEventListener("focus", enter);
    el.addEventListener("blur", leave);

    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", pointerDown);
      el.removeEventListener("pointerup", onChargeEnd);
      el.removeEventListener("focus", enter);
      el.removeEventListener("blur", leave);
    };
  }, [onHover, onChargeStart, onChargeEnd]);

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

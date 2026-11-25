"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip mouse glow listener on touch / coarse-pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let rafId = 0;
    let targetX = -9999;
    let targetY = -9999;

    const update = () => {
      rafId = 0;
      el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };

    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      <div
        ref={glowRef}
        className="absolute -left-[320px] -top-[320px] h-[640px] w-[640px] rounded-full will-change-transform"
        style={{
          transform: "translate3d(-9999px, -9999px, 0)",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 35%, transparent 65%)",
        }}
      />
    </div>
  );
}

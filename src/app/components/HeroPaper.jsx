"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A paper-like hero with 4 draggable “stickers”.
 * - Off-white, grainy background (CSS only)
 * - Pointer + touch drag with momentum-free, precise control
 * - Keeps stickers inside the hero bounds
 * - Highest z-index sticker floats to the top when grabbed
 */
export default function HeroPaper({
  heightClass = "h-[68vh] min-h-[520px]",
  initial = [
    { x: 60,  y: 60,  r: 64, label: "z" },
    { x: 220, y: 140, r: 56, label: "u" },
    { x: 420, y: 90,  r: 72, label: "i" },
    { x: 320, y: 240, r: 64, label: "i" }
  ],
}) {
  const wrapRef = useRef(null);
  // local state for sticker positions (px) and z-order
  const [stickers, setStickers] = useState(
    initial.map((s, i) => ({ ...s, id: i, z: i + 1 }))
  );

  // dragging session (not in React state to avoid excess renders)
  const dragRef = useRef({
    id: null,          // active sticker id
    dx: 0, dy: 0,      // pointer offset inside the sticker when picked up
  });

  // keep sticker inside container
  const clampToBounds = (x, y, r, rect) => {
    const d = r; // we’re positioning by center; radius = r/2? We designed r as diameter? → r is diameter here.
    const half = d / 2;
    const minX = half;
    const minY = half;
    const maxX = rect.width - half;
    const maxY = rect.height - half;
    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  };

  // pointer handlers
  const onPointerDown = (e, id) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // bring this sticker to front
    setStickers(prev => {
      const maxZ = Math.max(...prev.map(s => s.z));
      return prev.map(s => (s.id === id ? { ...s, z: maxZ + 1 } : s));
    });

    const rect = wrap.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // find target sticker
    const s = stickers.find((x) => x.id === id);
    if (!s) return;
    const { x, y } = s;

    dragRef.current.id = id;
    dragRef.current.dx = pointerX - x;
    dragRef.current.dy = pointerY - y;

    // capture during drag
    wrap.setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    const id = dragRef.current.id;
    if (id == null) return;

    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    setStickers(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const target = {
          x: pointerX - dragRef.current.dx,
          y: pointerY - dragRef.current.dy,
        };
        const { x, y } = clampToBounds(target.x, target.y, s.r, rect);
        return { ...s, x, y };
      });
      return next;
    });
  };

  const endDrag = () => {
    dragRef.current.id = null;
    document.body.style.cursor = "";
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const up = endDrag;

    wrap.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      wrap.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [stickers]); // rebind if stickers length changes (rare)

  return (
    <section
      className={`relative ${heightClass} overflow-hidden rounded-2xl border border-black/10`}
    >
      {/* Paper background */}
      <div className="paper-grain absolute inset-0" />

      {/* Drag surface */}
      <div
        ref={wrapRef}
        className="absolute inset-0 touch-none cursor-grab"
      >
        {stickers.map((s) => {
          const size = s.r;    // treat r as DIAMETER for simplicity
          const half = size / 2;
          const style = {
            transform: `translate3d(${s.x - half}px, ${s.y - half}px, 0)`,
            width: size,
            height: size,
            zIndex: s.z,
          };
          return (
            <div
              key={s.id}
              role="button"
              aria-label="Draggable sticker"
              className="sticker circle select-none"
              style={style}
              onPointerDown={(e) => onPointerDown(e, s.id)}
            >
              <div className="sticker-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Optional caption or CTA area (kept for parity with your old hero) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-10">
        <p className="max-w-xl text-sm text-neutral-600">
          Drag the circles. These will become your custom shapes later.
        </p>
      </div>
    </section>
  );
}

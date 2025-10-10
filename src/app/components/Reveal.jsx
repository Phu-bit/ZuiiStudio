"use client";

import { useEffect, useRef } from "react";
import {animate as anime} from "animejs";

export default function Reveal({ children, as: Tag = "div", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        anime({
          targets: el,
          translateY: [10, 0],
          opacity: [0, 1],
          duration: 800,
          easing: "easeOutQuad"
        });
        io.disconnect();
      }
    }, { threshold: 0.15 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}

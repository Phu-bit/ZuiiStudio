"use client";
import { useMemo } from "react";

function CountPill({ children, active }) {
  return (
    <span
      className={[
        "rounded-full border px-2 py-0.5 text-xs leading-none transition-colors",
        active
          ? "border-black text-neutral-400"
          : "border-neutral-300 text-neutral-400 group-hover:border-neutral-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function FilterBar({ projects, active, onChange }) {
  const { categories, counts } = useMemo(() => {
    const set = new Set();
    const map = {};
    projects.forEach((p) => {
      (p.categories || []).forEach((c) => {
        set.add(c);
        map[c] = (map[c] || 0) + 1;
      });
    });
    return { categories: Array.from(set).sort(), counts: map };
  }, [projects]);

  const allCount = projects.length;

  const base =
    "group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm " +
    "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30";
  const idle = "border-black text-neutral-500 hover:bg-neutral-100 hover:border-neutral-400";
  const activeCls = "border-black text-black bg-white";

  const Underline = ({ isActive }) => (
    <span
      aria-hidden="true"
      className={[
        "pointer-events-none absolute left-3 right-3 -bottom-[3px] h-[2px] bg-black",
        "origin-center will-change-transform transition-transform duration-300",
        isActive ? "scale-x-100" : "scale-x-0",
      ].join(" ")}
      style={{ transform: "scaleX(1)" }} // baseline so Tailwind classes toggle scale
    />
  );

  return (
    <div className="flex flex-wrap gap-2">
      {/* All */}
      <button
        type="button"
        aria-pressed={active === null}
        onClick={() => onChange(null)}
        className={[base, active === null ? activeCls : idle].join(" ")}
      >
        <span>All</span>
        <CountPill active={active === null}>{allCount}</CountPill>
        <Underline isActive={active === null} />
      </button>

      {/* Categories */}
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : cat)}
            className={[base, isActive ? activeCls : idle].join(" ")}
          >
            <span>{cat}</span>
            <CountPill active={isActive}>{counts[cat]}</CountPill>
            <Underline isActive={isActive} />
          </button>
        );
      })}
    </div>
  );
}

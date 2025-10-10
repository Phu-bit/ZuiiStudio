"use client";
import { useMemo } from "react";

export default function FilterBar({ projects, active, onChange }) {
  const { categories, counts } = useMemo(() => {
    const set = new Set();
    const map = {};
    projects.forEach(p => {
      (p.categories || []).forEach(c => {
        set.add(c);
        map[c] = (map[c] || 0) + 1;
      });
    });
    return { categories: Array.from(set).sort(), counts: map };
  }, [projects]);

  const allCount = projects.length;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border px-4 py-2 text-sm transition ${
          active === null ? "bg-black text-white" : "hover:bg-black/5"
        }`}
      >
        All {allCount}
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            active === cat ? "bg-black text-white" : "hover:bg-black/5"
          }`}
        >
          {cat} {counts[cat]}
        </button>
      ))}
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import FilterBar from "./FilterBar.jsx";
import ProjectCard from "./ProjectCard";
import { projects } from "../lib/projects";

export default function ProjectGallery() {
  const [filter, setFilter] = useState(null);
  const filtered = useMemo(() => {
    if (!filter) return projects;
    return projects.filter(p => (p.categories || []).includes(filter));
  }, [filter]);

  return (
    <section className="space-y-6">
      <FilterBar projects={projects} active={filter} onChange={setFilter} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/10">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />
      </div>
      <div className="mt-3">
        {project.client && (
          <p className="text-xs uppercase tracking-wide text-neutral-500">{project.client}</p>
        )}
        <h3 className="text-lg font-medium leading-tight">{project.title}</h3>
        <p className="text-sm text-neutral-500">
          {project.year}{project.location ? ` — ${project.location}` : ""}
        </p>
      </div>
    </Link>
  );
}

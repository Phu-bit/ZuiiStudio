import Image from "next/image";
import Link from "next/link";
import { projects } from "../lib/projects";

export const metadata = { title: "Work – Your Studio" };

export default function WorkIndex() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Work</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={p.cover} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{p.title}</h2>
                <span className="text-sm text-white/70">{p.year}</span>
              </div>
              <p className="text-sm text-white/70">{p.tags.join(" · ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

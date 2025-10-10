import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllProjectSlugs, getProject } from "../../lib/projects";

export async function generateStaticParams() {
  return getAllProjectSlugs();
}

export async function generateMetadata({ params }) {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} – Your Studio`,
    openGraph: {
      title: project.title,
      images: [{ url: project.cover }]
    }
  };
}

export default function ProjectPage({ params }) {
  const project = getProject(params.slug);
  if (!project) return notFound();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-white/80">{project.year} · {project.tags.join(" · ")}</p>
        <p className="max-w-prose text-white/90">{project.summary}</p>
      </header>

      <section className="space-y-6">
        {project.media.map((m, i) =>
          m.type === "image" ? (
            <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={m.src} alt={m.alt ?? project.title} fill className="object-cover" />
            </div>
          ) : (
            <div key={i} className="overflow-hidden rounded-2xl">
              <video
                src={m.src}
                poster={m.poster}
                className="w-full h-auto"
                controls
                playsInline
              />
            </div>
          )
        )}
      </section>
    </article>
  );
}

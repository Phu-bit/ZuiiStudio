// import ProjectGallery from "./components/ProjectGallery"; // if you’re using the gallery
// import HeroDraggableGallery from "./components/HeroDraggableGallery";
import { getHeroImages } from "./components/getHeroImages";
import HeroPaper from "./components/HeroPaper";


export default async function Home() {
  const images = await getHeroImages(); // ['/hero/01.jpg', ...]
  return (
    <div className="space-y-16">
        <HeroPaper />

      {/* HERO with draggable gallery */}
      <section className="relative h-[68vh] min-h-[520px] overflow-hidden rounded-2xl border border-black/10">
        {/* <HeroDraggableGallery images={images} /> */}
        {/* Text overlay (optional) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[75] p-6 md:p-10">
          <div className="max-w-2xl pointer-events-auto">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow">
              We're a design studio that believes in expression.
            </h1>
            <p className="mt-3 max-w-xl text-white/80">
              Drag the gallery, click any tile to zoom.
            </p>
          </div>
        </div>
      </section>

      {/* …rest of your homepage (filters + project cards) */}
      {/* { <ProjectGallery /> } */}
    </div>
  );
}

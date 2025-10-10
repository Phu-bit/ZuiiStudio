export const projects = [
  {
    slug: "sample-brand-refresh",
    title: "Sample Brand Refresh",
    client: "Acme",
    year: 2025,
    location: "New York",
    categories: ["Brand", "3D"],
    tags: ["Branding", "Identity"],
    summary: "A crisp identity system for a modern product studio.",
    cover: "/work/sample-1.jpg",
    media: [
      { type: "image", src: "/work/sample-1.jpg", alt: "Logo and applications" },
      { type: "video", src: "/work/sample-1.mp4", poster: "/work/sample-1.jpg", alt: "Animated logo stinger" }
    ]
  },
  {
    slug: "immersive-web-experience",
    title: "Immersive Web Experience",
    client: "Contoso",
    year: 2024,
    location: "Los Angeles",
    categories: ["Interactive", "Creative Tech"],
    tags: ["WebGL", "Three.js"],
    summary: "Playful physics and particles for a launch campaign.",
    cover: "/work/sample-2.jpg",
    media: [{ type: "image", src: "/work/sample-2.jpg", alt: "Hero section with particles" }]
  },
    {
    slug: "Fashion-Show",
    title: "fashion-show",
    client: "2 Percent",
    year: 2024,
    location: "Boulder",
    categories: ["Interactive", "Event"],
    tags: ["WebGL", "Three.js"],
    summary: "Playful physics and particles for a launch campaign.",
    cover: "/work/sample-2.jpg",
    media: [{ type: "image", src: "/work/sample-2.jpg", alt: "Hero section with particles" }]
  },

  
  
];



export function getProject(slug) {
  return projects.find(p => p.slug === slug) || null;
}
export function getAllProjectSlugs() {
  return projects.map(p => ({ slug: p.slug }));
}

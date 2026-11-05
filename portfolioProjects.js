/**
 * Techuilla Agency — Portfolio Book Project Catalog
 * 
 * Modular data structure for the 3D Vintage Portfolio Book.
 * Add, reorder, or remove projects here without modifying component code.
 */
const portfolioProjects = [
  {
    id: "01",
    number: "01",
    title: "NEXUS AI OS",
    category: "AI & AUTOMATION",
    client: "Apex Enterprise Systems",
    year: "2026",
    description: "Autonomous multi-agent orchestration platform that integrates deep predictive modeling and natural-language operations into core enterprise workflows.",
    mediaType: "image",
    media: "assets/project_01_nexus.jpg",
    tags: ["Agent Swarms", "FastAPI Core", "Neural Pipelines"],
    stat: "14x Faster Processing",
    caption: "Fig 1.1 — Monolithic server orchestration node with luminous neural telemetry."
  },
  {
    id: "02",
    number: "02",
    title: "AETHER SPATIAL",
    category: "WEBSITES & WEB APPLICATIONS",
    client: "Vanguard Studio Global",
    year: "2026",
    description: "Spatial 3D digital flagship with WebGPU-accelerated volumetric rendering, precision physics, and tactile interaction design.",
    mediaType: "image",
    media: "assets/project_02_spatial.jpg",
    tags: ["Three.js", "WebGPU", "Real-Time 3D", "Spatial UI"],
    stat: "+310% Session Depth",
    caption: "Fig 2.1 — High-fidelity spatial analytics console with curved glass display."
  },
  {
    id: "03",
    number: "03",
    title: "SYNAPSE CINEMA",
    category: "CGI / VFX & AI FILM PRODUCTION",
    client: "Chronos Film Collective",
    year: "2026",
    description: "Hybrid generative diffusion and cinematic VFX production exploring monumental brutalist monoliths under golden hour desert lighting.",
    mediaType: "image",
    media: "assets/project_03_cinema.jpg",
    tags: ["ComfyUI", "Unreal Engine 5", "Anamorphic Color"],
    stat: "Gold Lion Shortlist",
    caption: "Fig 3.1 — Production still: The Chronos Portal under twilight atmospheric haze."
  },
  {
    id: "04",
    number: "04",
    title: "AURA ATELIER",
    category: "CREATIVE MEDIA & DESIGN",
    client: "Aura Creative Studio London",
    year: "2026",
    description: "Tactile corporate identity program featuring heavy blind debossing, custom typographic scales, and restrained warm ochre accenting.",
    mediaType: "image",
    media: "assets/project_04_brand.jpg",
    tags: ["Brand Identity", "Custom Type", "Physical Print", "Styleguide"],
    stat: "100% Brand Recall",
    caption: "Fig 4.1 — Handcrafted cotton stationery suite with wax seal and precision deboss."
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { portfolioProjects };
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wordle PRO",
    short_name: "Wordle PRO",
    description: "Wordle PRO — Word game built with Next.js, Atomic Design, and Drizzle ORM",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

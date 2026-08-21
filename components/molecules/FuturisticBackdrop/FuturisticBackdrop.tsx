"use client";

import React from "react";

export function FuturisticBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* 1. Vibrant Pulsing Light Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-60 transition-opacity duration-300">
        {/* Top Left Orb - Primary Brand Glow */}
        <div
          className="pulsing-orb-1 absolute -left-20 -top-20 size-[500px] rounded-full sm:size-[680px] lg:size-[820px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-1, var(--primary)) 0%, color-mix(in srgb, var(--primary) 35%, transparent) 45%, transparent 70%)",
          }}
        />

        {/* Top Right / Center Orb - Secondary Accent Glow */}
        <div
          className="pulsing-orb-2 absolute -right-20 top-1/4 size-[450px] rounded-full sm:size-[600px] lg:size-[720px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-2, var(--secondary)) 0%, color-mix(in srgb, var(--secondary) 30%, transparent) 50%, transparent 70%)",
          }}
        />

        {/* Bottom Ambient Orb - Deep Radiant Glow */}
        <div
          className="pulsing-orb-3 absolute bottom-0 left-1/3 size-[520px] -translate-x-1/2 rounded-full sm:size-[720px] lg:size-[880px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary-container, var(--primary)) 40%, transparent) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* 2. Soft Light Diffusion Blanket */}
      <div className="absolute inset-0 backdrop-blur-[60px] sm:backdrop-blur-[80px]" />
    </div>
  );
}

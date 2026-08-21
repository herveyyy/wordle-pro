"use client";

import React from "react";

export function FuturisticBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* 1. Giant Pulsing Blurred Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Left Orb - Primary Brand Glow */}
        <div
          className="pulsing-orb-1 absolute -left-24 -top-24 size-[480px] rounded-full sm:size-[640px] lg:size-[780px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-1, var(--primary)) 0%, color-mix(in srgb, var(--primary) 40%, transparent) 45%, transparent 70%)",
          }}
        />

        {/* Top Right / Center Orb - Secondary Accent Glow */}
        <div
          className="pulsing-orb-2 absolute -right-20 top-1/4 size-[420px] rounded-full sm:size-[560px] lg:size-[680px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-2, var(--secondary)) 0%, color-mix(in srgb, var(--secondary) 35%, transparent) 50%, transparent 70%)",
          }}
        />

        {/* Bottom Ambient Orb - Deep Radiant Glow */}
        <div
          className="pulsing-orb-3 absolute bottom-0 left-1/3 size-[500px] -translate-x-1/2 rounded-full sm:size-[700px] lg:size-[850px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary-container, var(--primary)) 60%, transparent) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* 2. Glassmorphism Light Diffusion & Blur Blanket */}
      <div className="absolute inset-0 backdrop-blur-[60px] sm:backdrop-blur-[80px]" />

      {/* 3. Subtle Futuristic Geometric Grid & Constellations */}
      <div className="futuristic-dots absolute inset-0 opacity-40" />

      <svg
        className="absolute inset-0 h-full w-full text-primary/30"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.18" stroke="currentColor" strokeWidth="1">
          <path d="M120 180 L320 180 L320 380" />
          <path d="M1320 120 L1120 120 L1120 280 L920 280" />
          <path d="M80 620 L280 620 L280 420 L480 420" />
          <path d="M1360 720 L1160 720 L1160 520" />
          <line x1="320" y1="180" x2="520" y2="80" />
          <line x1="1120" y1="280" x2="960" y2="400" />
          <line x1="480" y1="420" x2="640" y2="320" />
          <line x1="720" y1="160" x2="720" y2="740" strokeDasharray="4 8" opacity="0.4" />
        </g>

        <g fill="currentColor">
          {[
            [120, 180],
            [320, 180],
            [320, 380],
            [1320, 120],
            [1120, 120],
            [920, 280],
            [280, 620],
            [480, 420],
            [1160, 720],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" opacity="0.4" />
          ))}
          <circle cx="720" cy="450" r="4" opacity="0.6" className="animate-ping" />
        </g>
      </svg>

      {/* 4. Ambient Top Light Shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}


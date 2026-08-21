import type { ReactNode } from "react";
import Link from "next/link";
import { getAuthShellContent } from "./authShell.hooks";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  const content = getAuthShellContent(title, description);

  return (
    <div className="relative h-screen w-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-surface flex items-center justify-center p-4 sm:p-6 font-(family-name:--font-comic-relief) select-none">
      <FuturisticBackdrop />

      <main className="futuristic-frame relative z-10 w-full max-w-md rounded-3xl border border-primary/20 bg-surface-container-low/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-4 group">
            <div className="flex gap-1">
              {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                <span
                  key={i}
                  className="flex size-7 items-center justify-center rounded-lg bg-primary font-display text-xs font-bold text-on-primary shadow-xs transition-transform group-hover:-translate-y-0.5"
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="flex items-center justify-center rounded-lg bg-secondary px-2 py-0.5 font-display text-xs font-bold text-on-secondary shadow-xs">
              PRO
            </span>
          </Link>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
            {content.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-on-surface-muted">
            {content.description}
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}

export function AuthShellFallback({ title }: { title: string }) {
  return (
    <AuthShell title={title} description="Loading...">
      <div className="h-12 w-full animate-pulse rounded-2xl bg-surface-container-high" />
    </AuthShell>
  );
}

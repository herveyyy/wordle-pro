import type { Metadata } from "next";
import "./globals.css";
import { ThemeEditor } from "@/components/molecules/ThemeEditor/ThemeEditor";

export const metadata: Metadata = {
  title: "Wordle PRO",
  description: "Wordle PRO — Built with Next.js, Atomic Design, Drizzle ORM, and Better Auth",
  appleWebApp: {
    capable: true,
    title: "Wordle PRO",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-(family-name:--font-comic-relief)">
        {children}
        <ThemeEditor />
      </body>
    </html>
  );
}



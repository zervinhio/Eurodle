// src/app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Eurodle | Daily Euroleague Player Puzzle",
  description: "Guess today's hidden Euroleague player in 8 attempts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
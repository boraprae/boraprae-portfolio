import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yainezu — Software Engineer & Creative Mind",
  description: "A little corner of the internet by Yainezu. Software engineering, thoughtful interfaces, scroll-driven visual stories, and an interactive workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

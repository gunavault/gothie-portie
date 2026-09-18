import type { Metadata, Viewport } from "next";
import { Michroma, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guna Dharma — Portfolio",
  description:
    "Cybersecurity engineer and software developer in Jakarta. Securing high-stakes systems by day — designing, shooting and watching films by night.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

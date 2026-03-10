// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import VideoModalClient from "../components/VideoModalClient";
import localFont from "next/font/local";
import Providers from "./providers";
import GlobalFooter from "@/components/layout/GlobalFooter";

export const metadata: Metadata = {
  title: "Erasmus PWA",
  description: "Learning platform",
};

const notoSans = localFont({
  src: [
    { path: "../public/fonts/NotoSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/NotoSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={notoSans.variable}>
    <body suppressHydrationWarning className="font-sans">
      <Providers>
        {children}
       <GlobalFooter />
      <VideoModalClient />
     </Providers>
     </body>  
    </html>
  );
}

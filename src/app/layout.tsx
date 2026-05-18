import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOV.IN.EXE - National Citizen Suffering Portal",
  description: "The official portal for all your bureaucratic nightmares. Apply for Aadhaar verification, Ration Cards, Passports, and verify your sanity. Authorized by the Ministry of Suffering under the Suffer-Act 1947.",
  keywords: ["government", "bureaucracy", "pain", "aadhaar", "ration card", "passport", "suffer", "unhinged", "ux", "nextjs", "india"],
  authors: [{ name: "Ministry of Digital Suffering" }],
  openGraph: {
    title: "GOV.IN.EXE - National Citizen Suffering Portal",
    description: "The official portal for all your bureaucratic nightmares. Link your Aadhaar, draw DNA sequences, and register buffalo biometrics.",
    url: "https://govdotin.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOV.IN.EXE - National Citizen Suffering Portal",
    description: "Official portal for bureaucratic nightmares. Sanity verification inside.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}

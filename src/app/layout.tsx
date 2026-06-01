import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import Header from "./components/Header";
import ScrollRevealObserver from "./components/ScrollRevealObserver";

import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: {
    default: "Ofside",
    template: "%s | Ofside",
  },
  description: "Ofside is India's sports ecosystem — create matches, score live, track stats, climb leaderboards, and stay connected to local sports.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ofside",
    description: "Create matches, score live, track stats, and stay connected to your local sports scene with Ofside.",
    type: "website",
    url: "https://ofside.in/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ofside",
      },
    ],
    siteName: "Ofside",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ofside",
    description: "India's sports ecosystem — match creation, live scoring, stats, and leaderboards.",
    images: ["/og-image.png"],
    site: "@ofsideindia",
  },
  metadataBase: new URL("https://ofside.in/"),
  alternates: {
    canonical: "/",
  },
  other: {
    instagram: "https://www.instagram.com/ofsideindia/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <ScrollRevealObserver />
        <Header />
        {/* Mobile: offset for absolute header; home hero uses -mt to full-bleed under the nav */}
        <div className="pt-[4.5rem] sm:pt-0">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

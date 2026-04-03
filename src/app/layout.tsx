import type { Metadata } from "next";

import Header from "./components/Header";
import ScrollRevealObserver from "./components/ScrollRevealObserver";

import "./globals.css";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Ofside",
    template: "%s | Ofside",
  },
  description: "Ofside is India's sports ecosystem for players, venue partners, bookings, discovery, and local sports growth.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ofside",
    description: "Explore Ofside for venue discovery, venue onboarding, player journeys, and sports ecosystem growth.",
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
    description: "India's sports ecosystem for players and venue partners.",
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
    <html lang="en">
      <body className="antialiased">
        <ScrollRevealObserver />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

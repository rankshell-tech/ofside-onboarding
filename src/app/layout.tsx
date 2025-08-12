import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";

import Header from "./components/Header";
import "./globals.css";

// Initialize Inter font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "SportsVenue",
    template: "%s | SportsVenue",
  },
  description: "Book and manage sports venues with ease.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SportsVenue",
    description: "Book and manage sports venues with ease.",
    type: "website",
    url: "https://ofside.in/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SportsVenue Booking",
      },
    ],
    siteName: "SportsVenue",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportsVenue",
    description: "Book and manage sports venues with ease.",
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
      <body className={`${inter.variable}  antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

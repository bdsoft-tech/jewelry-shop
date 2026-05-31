import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CatalogProvider } from "@/app/components/Catalog/CatalogProvider";
import { CartProvider } from "@/app/components/Cart/CartProvider";
import Footer from "@/app/components/Navigation/Footer";
import Navbar from "@/app/components/Navigation/Navbar";
import FloatingChat from "./components/Navigation/FloatingChat";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurelle Fine Jewelry",
  description: "Premium fine jewelry ecommerce experience for modern heirlooms.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aurelle Fine Jewelry",
    title: "Aurelle Fine Jewelry",
    description:
      "Premium fine jewelry ecommerce experience for modern heirlooms.",
    url: "/",
    images: [
      {
        url: "/jewelry-hero.png",
        alt: "Aurelle fine jewelry collection preview with gold and diamond pieces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurelle Fine Jewelry",
    description:
      "Premium fine jewelry ecommerce experience for modern heirlooms.",
    images: ["/jewelry-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <CatalogProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              {children}
              <Footer />
              <FloatingChat />
            </div>
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}

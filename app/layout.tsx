import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/app/components/Cart/CartProvider";
import Footer from "@/app/components/Navigation/Footer";
import Navbar from "@/app/components/Navigation/Navbar";
import FloatingChat from "./components/Navigation/FloatingChat";
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
  title: "Aurelle Fine Jewelry",
  description: "Premium fine jewelry ecommerce experience for modern heirlooms.",
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
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <Footer />
            <FloatingChat />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gem, Search, User, Menu, X } from "lucide-react";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import CartLink from "@/app/components/Cart/CartLink";
import { getCategoryHref } from "@/app/lib/catalog";

export default function Navbar() {
  const { categories } = useCatalog();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "New In", href: "/products" },
    ...categories.slice(0, 3).map((category) => ({
      label: category.name,
      href: `/products${getCategoryHref(category)}`,
    })),
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200/80 bg-[#fbfaf7]/95 backdrop-blur-md shadow-sm"
            : "border-b border-stone-200/40 bg-[#fbfaf7]"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3 group"
            aria-label="Maison Aurelle home"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d] transition-transform group-hover:scale-105">
              <Gem size={18} strokeWidth={1.7} aria-hidden="true" className="sm:size-5.25" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-semibold tracking-[0.16em] text-[#1f2a24] sm:text-sm sm:tracking-[0.18em]">
                AURELLE
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-[#8b6d2f] sm:block">
                Fine Jewelry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex lg:gap-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative transition hover:text-[#8b1e3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] rounded-sm py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#8b1e3f] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search - Desktop */}
            <Link
              href="/products"
              className="hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition-all hover:border-[#d7b56d] hover:text-[#8b1e3f] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] sm:flex"
              aria-label="Search products"
              title="Search products"
            >
              <Search size={16} aria-hidden="true" className="sm:size-4.5" />
            </Link>

            {/* Account - Desktop */}
            <Link
              href="/login"
              className="hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition-all hover:border-[#d7b56d] hover:text-[#8b1e3f] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] sm:flex"
              aria-label="Account"
              title="Account"
            >
              <User size={16} aria-hidden="true" className="sm:size-4.5" />
            </Link>

            {/* Cart */}
            <CartLink />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition-all hover:border-[#d7b56d] hover:text-[#8b1e3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed left-0 right-0 top-16 z-40 bg-[#fbfaf7] shadow-xl transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-col p-4" aria-label="Mobile navigation">
          {/* Mobile Search */}
          <Link
            href="/products"
            className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-stone-700 transition-all hover:border-[#d7b56d] hover:text-[#8b1e3f] mb-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Search size={18} />
            <span className="text-sm font-medium">Search products</span>
          </Link>

          {/* Mobile Navigation Items */}
          <div className="my-2 h-px bg-stone-200" />
          
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-[#1f2a24]/5 hover:text-[#8b1e3f] rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="my-2 h-px bg-stone-200" />

          {/* Mobile Account */}
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-[#1f2a24]/5 hover:text-[#8b1e3f] rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User size={18} />
            <span>Account</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
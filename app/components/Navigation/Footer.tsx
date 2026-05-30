"use client";

import Link from "next/link";
import { AtSign, Gem, Mail, MapPin } from "lucide-react";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import { getCategoryHref } from "@/app/lib/catalog";

export default function Footer() {
  const { categories } = useCatalog();
  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "New arrivals", href: "/products" },
        ...categories.slice(0, 4).map((category) => ({
          label: category.name,
          href: `/products${getCategoryHref(category)}`,
        })),
      ],
    },
    {
      title: "Client Care",
      links: [
        { label: "Shipping", href: "/products" },
        { label: "Returns", href: "/products" },
        { label: "Jewelry care", href: "/products" },
        { label: "Sizing guide", href: "/products" },
      ],
    },
    {
      title: "Maison",
      links: [
        { label: "Our atelier", href: "/" },
        { label: "Materials", href: "/" },
        { label: "Bespoke", href: "/products" },
        { label: "Journal", href: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-[#1f2a24] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1.8fr] lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="Maison Aurelle home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-[#8b6d2f]">
              <Gem size={22} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold tracking-[0.18em]">
                AURELLE
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.24em] text-[#d7b56d]">
                Fine Jewelry
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
            Hand-finished fine jewelry in responsibly sourced gold, diamonds,
            and pearls, crafted for quiet distinction.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/72">
            <p className="flex items-center gap-3">
              <MapPin size={16} aria-hidden="true" />
              42 Maison Row, New York
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} aria-hidden="true" />
              concierge@aurelle.test
            </p>
            <p className="flex items-center gap-3">
              <AtSign size={16} aria-hidden="true" />
              @aurellejewelry
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7b56d]">
                {section.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright 2026 Aurelle Fine Jewelry. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/products" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/products" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

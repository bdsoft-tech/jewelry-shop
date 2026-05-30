"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import {
  formatPrice,
  getProductHref,
} from "@/app/lib/catalog";

const assurances = [
  { label: "Certified stones", icon: ShieldCheck },
  { label: "Complimentary insured delivery", icon: Truck },
  { label: "Lifetime care", icon: Sparkles },
];

export default function Hero() {
  const { featuredProducts, getProductBySlug, products } = useCatalog();
  const heroProduct =
    getProductBySlug("nocturne-pearl-strand") ??
    featuredProducts[0] ??
    products[0];

  return (
    <section className="relative overflow-hidden bg-[#f7f1e8]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:min-h-[calc(100vh-5rem)] sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
            The Signature Collection
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] text-[#1f2a24] sm:text-5xl lg:text-7xl">
            Fine jewelry for the modern heirloom.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-stone-700 sm:text-lg">
            Sculptural gold, luminous pearls, and hand-selected diamonds made for
            daily rituals and once-in-a-lifetime moments.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#741832]"
            >
              Shop collection
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href="/products#bespoke"
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#1f2a24]/20 px-5 text-sm font-semibold text-[#1f2a24] transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
            >
              Book a consultation
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 text-sm text-stone-700">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#8b6d2f] shadow-sm">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="font-medium leading-snug">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl shadow-stone-900/10 sm:min-h-[500px] lg:min-h-[660px]">
          <Image
            src="/jewelry-hero.png"
            alt="Pearl necklace, gold hoop earrings, diamond ring, and tennis bracelet on stone and silk"
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
          {heroProduct ? (
            <Link
              href={getProductHref(heroProduct)}
              className="absolute bottom-4 left-4 right-4 grid gap-3 rounded-lg bg-[#1f2a24]/92 p-4 text-white backdrop-blur transition hover:bg-[#2d3b33]/95 sm:left-6 sm:right-auto sm:w-80 sm:p-5"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b56d]">
                Limited release
              </span>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{heroProduct.name}</p>
                  <p className="mt-1 text-sm text-white/72">
                    {heroProduct.materials.slice(0, 2).join(", ")}
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  {formatPrice(heroProduct.price)}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

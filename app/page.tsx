import CategorySection from "@/app/components/CategorySection";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import { featuredProducts } from "@/app/data/products";
import { ArrowRight, BadgeCheck, Gem, Sparkles } from "lucide-react";
import Link from "next/link";

const atelierNotes = [
  {
    title: "Responsibly sourced",
    description:
      "Traceable precious metals and vetted stones selected with strict standards.",
    icon: BadgeCheck,
  },
  {
    title: "Made to endure",
    description:
      "Balanced settings, secure closures, and hand-finished details throughout.",
    icon: Gem,
  },
  {
    title: "Personal service",
    description:
      "Private consultations for sizing, styling, remounting, and bespoke work.",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-[#fbfaf7]">
      <Hero />

      {/* Brand promises section */}
      <section
        className="border-y border-stone-200 bg-[#1f2a24] py-4 text-white"
        aria-labelledby="promises-heading"
      >
        <h2 id="promises-heading" className="sr-only">
          Our commitments
        </h2>
        <div className="mx-auto grid max-w-7xl gap-3 px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] sm:grid-cols-3 sm:px-6 lg:px-8">
          <p>18k recycled gold</p>
          <p>Conflict-free diamonds</p>
          <p>Insured worldwide shipping</p>
        </div>
      </section>

      {/* Featured products section */}
      <section className="py-20 sm:py-24" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
                Featured pieces
              </p>
              <h2
                id="featured-heading"
                className="mt-4 max-w-2xl text-4xl font-semibold text-[#1f2a24] sm:text-5xl"
              >
                Designed for every light you step into.
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#1f2a24] px-4 text-sm font-semibold text-white transition hover:bg-[#2d3b33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d]"
            >
              Shop all
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      {/* Atelier standards section */}
      <section
        className="bg-[#f7f1e8] py-20 sm:py-24"
        aria-labelledby="atelier-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
              The atelier standard
            </p>
            <h2
              id="atelier-heading"
              className="mt-4 text-4xl font-semibold text-[#1f2a24] sm:text-5xl"
            >
              Quiet luxury, engineered with intent.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-stone-700">
              Every Aurelle piece is reviewed for proportion, comfort, setting
              security, and long-term care before it reaches your jewelry box.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {atelierNotes.map((note) => {
              const Icon = note.icon;
              return (
                <div
                  key={note.title}
                  className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]"
                    aria-hidden="true"
                  >
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#1f2a24]">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {note.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

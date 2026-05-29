import Link from "next/link";
import { Gem, Search, User } from "lucide-react";
import CartLink from "@/app/components/Cart/CartLink";
import { productCategories } from "@/app/data/products";

const navItems = [
  { label: "New In", href: "/products" },
  ...productCategories
    .filter((category) =>
      ["rings", "necklaces", "bespoke"].includes(category.id),
    )
    .map((category) => ({ label: category.name, href: category.href })),
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fbfaf7]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Maison Aurelle home">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]">
            <Gem size={21} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-[0.18em] text-[#1f2a24]">
              AURELLE
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[#8b6d2f]">
              Fine Jewelry
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-stone-700 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[#8b1e3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition hover:border-[#d7b56d] hover:text-[#8b1e3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] sm:flex"
            aria-label="Search products"
            title="Search products"
          >
            <Search size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/login"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 transition hover:border-[#d7b56d] hover:text-[#8b1e3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d] sm:flex"
            aria-label="Account"
            title="Account"
          >
            <User size={18} aria-hidden="true" />
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}

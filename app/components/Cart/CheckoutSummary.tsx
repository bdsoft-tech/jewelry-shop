"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/app/components/Cart/CartProvider";
import {
  formatPrice,
  getProductHref,
  type CatalogProduct,
} from "@/app/data/products";

type CheckoutSummaryProps = {
  products: readonly CatalogProduct[];
};

type CheckoutRow = {
  product: CatalogProduct;
  quantity: number;
  lineTotal: number;
};

export default function CheckoutSummary({ products }: CheckoutSummaryProps) {
  const { hydrated, items } = useCart();

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const rows = items
    .map<CheckoutRow | null>((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
        lineTotal: (product.price ?? 0) * item.quantity,
      };
    })
    .filter((row): row is CheckoutRow => row !== null);

  const subtotal = rows.reduce((total, row) => total + row.lineTotal, 0);

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
          Secure checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-[#1f2a24]">
          Complete your order
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-700">
          Insured delivery, signature confirmation, and gift wrapping are
          included with eligible pieces.
        </p>

        <form className="mt-8 grid gap-5">
          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Contact email
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1f2a24]">
                First name
              </span>
              <input
                type="text"
                className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[#1f2a24]">
                Last name
              </span>
              <input
                type="text"
                className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Delivery address
            </span>
            <textarea
              rows={4}
              className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
          </label>

          <div className="rounded-lg bg-[#f7f1e8] p-4">
            <div className="flex items-center gap-3 text-[#1f2a24]">
              <CreditCard size={18} aria-hidden="true" />
              <p className="text-sm font-semibold">
                Card, wallet, and concierge payment support
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832] disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={!hydrated || rows.length === 0}
          >
            <LockKeyhole size={17} aria-hidden="true" />
            Place order
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-[#1f2a24]">
          <ShieldCheck size={22} aria-hidden="true" />
          <h2 className="text-xl font-semibold">Protected purchase</h2>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          Your selected pieces are prepared with insured delivery, signature
          confirmation, and jewelry documentation.
        </p>

        <div className="mt-6 border-t border-stone-200 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
            Bag summary
          </h3>

          {hydrated && rows.length > 0 ? (
            <div className="mt-5 divide-y divide-stone-200">
              {rows.map(({ product, quantity, lineTotal }) => (
                <div key={product.id} className="flex gap-4 py-4 first:pt-0">
                  <Link
                    href={getProductHref(product)}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{ objectPosition: product.image.objectPosition }}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={getProductHref(product)}
                      className="block truncate text-sm font-semibold text-[#1f2a24] transition hover:text-[#8b1e3f]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-stone-500">
                      Quantity {quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                      {product.price === null
                        ? "Consultation item"
                        : formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-stone-300 p-5 text-sm leading-6 text-stone-600">
              Your bag is empty.{" "}
              <Link
                href="/products"
                className="font-semibold text-[#8b1e3f] transition hover:text-[#741832]"
              >
                Browse jewelry
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 text-lg font-semibold text-[#1f2a24]">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </aside>
    </section>
  );
}

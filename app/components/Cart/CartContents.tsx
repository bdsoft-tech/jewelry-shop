"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/app/components/Cart/CartProvider";
import {
  formatPrice,
  getCategoryName,
  getProductHref,
  type CatalogProduct,
} from "@/app/data/products";

type CartContentsProps = {
  products: readonly CatalogProduct[];
};

type CartRow = {
  product: CatalogProduct;
  quantity: number;
  lineTotal: number;
};

export default function CartContents({ products }: CartContentsProps) {
  const { clearCart, hydrated, items, removeItem, setQuantity } = useCart();

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const cartRows = useMemo(
    () =>
      items
        .map((item) => {
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
        .filter((row): row is CartRow => row !== null),
    [items, productMap],
  );

  const subtotal = cartRows.reduce((total, row) => total + row.lineTotal, 0);
  const shipping = subtotal > 0 ? 0 : null;
  const total = subtotal + (shipping ?? 0);

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]">
          <ShoppingBag size={26} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-[#1f2a24]">
          Loading your bag
        </h1>
      </section>
    );
  }

  if (cartRows.length === 0) {
    return (
      <section className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]">
          <ShoppingBag size={26} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-[#1f2a24]">
          Your bag is ready for something beautiful.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-stone-700">
          Add pieces from the collection and return here for insured delivery
          and gift options.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
        >
          Browse jewelry
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
              Shopping bag
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#1f2a24]">
              Your selected pieces
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
          >
            <Trash2 size={16} aria-hidden="true" />
            Clear bag
          </button>
        </div>

        <div className="divide-y divide-stone-200">
          {cartRows.map(({ product, quantity, lineTotal }) => (
            <article
              key={product.id}
              className="grid gap-4 py-5 sm:grid-cols-[120px_1fr] sm:gap-5"
            >
              <Link
                href={getProductHref(product)}
                className="relative aspect-square overflow-hidden rounded-lg bg-stone-100"
                aria-label={`View ${product.name}`}
              >
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                  style={{ objectPosition: product.image.objectPosition }}
                />
              </Link>

              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
                    {getCategoryName(product.category)}
                  </p>
                  <Link
                    href={getProductHref(product)}
                    className="mt-2 block text-xl font-semibold text-[#1f2a24] transition hover:text-[#8b1e3f]"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                    {product.shortDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-[#8b1e3f]"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Remove
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                  <p className="text-lg font-semibold text-[#1f2a24]">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center overflow-hidden rounded-md border border-stone-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center text-stone-700 transition hover:bg-stone-100"
                      aria-label={`Decrease quantity for ${product.name}`}
                    >
                      <Minus size={15} aria-hidden="true" />
                    </button>
                    <span className="flex h-10 min-w-11 items-center justify-center border-x border-stone-300 px-3 text-sm font-semibold text-[#1f2a24]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center text-stone-700 transition hover:bg-stone-100"
                      aria-label={`Increase quantity for ${product.name}`}
                    >
                      <Plus size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-stone-600">
                    {product.price === null ? "Consultation item" : formatPrice(lineTotal)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#1f2a24]">Order summary</h2>
        <div className="mt-6 space-y-4 text-sm text-stone-700">
          <div className="flex items-center justify-between gap-4">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1f2a24]">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Insured shipping</span>
            <span className="font-semibold text-[#1f2a24]">
              {shipping === null ? "Calculated later" : "Complimentary"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 text-lg font-semibold text-[#1f2a24]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
        >
          Checkout
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link
          href="/products"
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-[#1f2a24] transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
        >
          Continue shopping
        </Link>
      </aside>
    </section>
  );
}

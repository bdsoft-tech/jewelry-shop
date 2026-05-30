"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gem, ShieldCheck, Star, Truck } from "lucide-react";
import AddToCartButton from "@/app/components/Cart/AddToCartButton";
import ProductCard from "@/app/components/ProductCard";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import {
  formatPrice,
  getCategoryHref,
} from "@/app/lib/catalog";

type ProductDetailsClientProps = {
  slug: string;
};

export default function ProductDetailsClient({
  slug,
}: ProductDetailsClientProps) {
  const { getCategoryById, getProductBySlug, getRelatedProducts } = useCatalog();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="flex-1 bg-[#fbfaf7] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
            Collection
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[#1f2a24]">
            Product not found
          </h1>
          <p className="mt-4 text-base leading-8 text-stone-700">
            This item may have been deleted or renamed in the live catalog.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
          >
            Back to collection
          </Link>
        </div>
      </main>
    );
  }

  const category = getCategoryById(product.categoryId);
  const relatedProducts = getRelatedProducts(product, 3);

  return (
    <main className="flex-1 bg-[#fbfaf7] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b1e3f] transition hover:text-[#741832]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to collection
        </Link>

        <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="scale-110 object-cover"
              style={{ objectPosition: product.image.objectPosition }}
            />
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={category ? `/products${getCategoryHref(category)}` : "/products"}
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f] transition hover:text-[#741832]"
                >
                  {category?.name ?? "Jewelry"}
                </Link>
                {product.badge ? (
                  <span className="rounded-md bg-[#f7f1e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8b6d2f]">
                    {product.badge}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#1f2a24] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg leading-8 text-stone-700">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-stone-200 py-5">
                <p className="text-3xl font-semibold text-[#1f2a24]">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-stone-700">
                  <Star
                    size={17}
                    className="fill-[#d7b56d] text-[#d7b56d]"
                    aria-hidden="true"
                  />
                  {product.rating.toFixed(1)}
                </div>
              </div>

              {product.price === null ? (
                <Link
                  href={category ? `/products${getCategoryHref(category)}` : "/products"}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
                >
                  Request consultation
                </Link>
              ) : (
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  className="mt-6 h-12 w-full bg-[#8b1e3f] hover:bg-[#741832]"
                />
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Insured delivery", icon: Truck },
                  { label: "Certified materials", icon: ShieldCheck },
                  { label: "Atelier care", icon: Gem },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-lg bg-[#f7f1e8] p-4 text-sm font-semibold text-[#1f2a24]"
                    >
                      <Icon
                        size={18}
                        className="mb-3 text-[#8b6d2f]"
                        aria-hidden="true"
                      />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
              <div>
                <h2 className="text-lg font-semibold text-[#1f2a24]">
                  Materials
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                  {product.materials.map((material) => (
                    <li key={material}>{material}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1f2a24]">
                  Details
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <h2 className="text-lg font-semibold text-[#1f2a24]">Care</h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {product.care}
                </p>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-20" aria-labelledby="related-heading">
            <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
                  More {category?.name ?? "Jewelry"}
                </p>
                <h2
                  id="related-heading"
                  className="mt-3 text-3xl font-semibold text-[#1f2a24]"
                >
                  Explore related pieces
                </h2>
              </div>
              <Link
                href={category ? `/products${getCategoryHref(category)}` : "/products"}
                className="text-sm font-semibold text-[#8b1e3f] transition hover:text-[#741832]"
              >
                View {category?.name ?? "Jewelry"}
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

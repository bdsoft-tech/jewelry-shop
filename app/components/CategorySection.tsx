"use client";

import Image from "next/image";
import Link from "next/link";
import {
  formatPrice,
  getCategoryHref,
  getProductHref,
  getProductsByCategory,
} from "@/app/lib/catalog";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";

export default function CategorySection() {
  const { categories, products } = useCatalog();

  return (
    <section className="py-20 sm:py-24" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
            Shop by category
          </p>
          <h2
            id="categories-heading"
            className="mt-4 text-4xl font-semibold text-[#1f2a24] sm:text-5xl"
          >
            Find your signature piece
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600">
            Each collection is crafted with intention, from everyday essentials
            to heirloom-worthy statements.
          </p>
        </div>

        <div className="mt-12 space-y-20">
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(
              products,
              category.id,
            ).slice(
              0,
              4,
            );

            return (
              <div key={category.id} className="scroll-mt-20" id={category.slug}>
                <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-2xl font-semibold text-[#1f2a24]">
                    {category.name}
                  </h3>
                  <Link
                    href={`/products${getCategoryHref(category)}`}
                    className="rounded-sm text-sm font-medium text-[#8b1e3f] transition hover:text-[#6b1632] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d]"
                  >
                    View all -&gt;
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={getProductHref(product)}
                      className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f2eb]">
                        <Image
                          src={product.image.src}
                          alt={product.image.alt}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="scale-110 object-cover transition duration-300 group-hover:scale-[1.18]"
                          style={{
                            objectPosition: product.image.objectPosition,
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-[#1f2a24]">
                          {product.name}
                        </h4>
                        <p className="mt-1 text-sm text-[#8b6d2f]">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

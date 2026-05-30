"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import {
  getCategoryHref,
  getProductsByCategory,
  matchesProductSearch,
  sortProductsByPrice,
} from "@/app/lib/catalog";
import { Search, SlidersHorizontal, X } from "lucide-react";

const sortLabels = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
} as const;

export default function ProductsPage() {
  const { categories, products } = useCatalog();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q")?.trim() ?? "";
  const sortParam = searchParams?.get("sort") ?? "featured";
  const sortOrder =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "featured";

  const filteredProducts = useMemo(() => {
    const productsMatchingQuery = products.filter((product) =>
      matchesProductSearch(
        product,
        searchQuery,
        categories.find((category) => category.id === product.categoryId)?.name,
      ),
    );

    return sortProductsByPrice(productsMatchingQuery, sortOrder);
  }, [categories, products, searchQuery, sortOrder]);

  function updateQuery(nextValues: Record<string, string | null>) {
    if (!searchParams) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  return (
    <main className="flex-1 bg-[#fbfaf7] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-stone-200 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
              Collection
            </p>
            <h1 className="mt-4 text-5xl font-semibold text-[#1f2a24]">
              Shop fine jewelry
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">
              Signature rings, luminous pearls, sculptural gold, and
              diamond-led pieces selected for lasting wear.
            </p>
          </div>

          <div className="grid gap-4 md:min-w-[24rem]">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                placeholder="Search by name, material, or category"
                onChange={(event) =>
                  updateQuery({ q: event.target.value || null })
                }
                className="h-12 w-full rounded-md border border-stone-300 bg-white pl-11 pr-12 text-sm text-[#1f2a24] outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => updateQuery({ q: null })}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-[#1f2a24]"
                  aria-label="Clear search"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <label className="flex items-center justify-between gap-4 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-[#1f2a24]">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} aria-hidden="true" />
                Price sort
              </span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  updateQuery({ sort: event.target.value || null })
                }
                className="min-w-0 bg-transparent text-sm font-semibold text-[#1f2a24] outline-none"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {searchQuery ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700">
                  {filteredProducts.length} result
                  {filteredProducts.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuery({ q: null })}
                  className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-[#8b1e3f] transition hover:border-[#8b1e3f] hover:bg-[#8b1e3f]/5"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-[#1f2a24]">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Browse
                </span>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={getCategoryHref(category)}
                    className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {searchQuery ? (
          <section className="mt-12" aria-labelledby="search-results-heading">
            <div className="mb-6 max-w-3xl">
              <h2
                id="search-results-heading"
                className="text-3xl font-semibold text-[#1f2a24]"
              >
                Search results
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Showing products that match your current URL query. Change the
                search term to filter the shared catalog in place.
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-sm leading-7 text-stone-600">
                No products matched “{searchQuery}”. Try a broader term such as
                gold, pearl, ring, or bespoke.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index === 0}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="mt-12 space-y-16">
            {categories.map((category) => {
              const categoryProducts = sortProductsByPrice(
                getProductsByCategory(products, category.id),
                sortOrder,
              );

              return (
                <section
                  key={category.id}
                  id={category.slug}
                  className="scroll-mt-28"
                  aria-labelledby={`${category.slug}-heading`}
                >
                  <div className="mb-6 max-w-3xl">
                    <h2
                      id={`${category.slug}-heading`}
                      className="text-3xl font-semibold text-[#1f2a24]"
                    >
                      {category.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        priority={category.id === "rings" && index === 0}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

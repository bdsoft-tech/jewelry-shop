import ProductCard from "@/app/components/ProductCard";
import { getProductsByCategory, productCategories } from "@/app/data/products";
import { SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="flex-1 bg-[#fbfaf7] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end">
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

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-[#1f2a24]">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Browse
            </span>
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-16">
          {productCategories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);

            return (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-28"
                aria-labelledby={`${category.id}-heading`}
              >
                <div className="mb-6 max-w-3xl">
                  <h2
                    id={`${category.id}-heading`}
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
      </div>
    </main>
  );
}

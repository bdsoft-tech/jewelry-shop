import Link from "next/link";
import { ChartNoAxesColumnIncreasing, Gem, PackageCheck } from "lucide-react";
import { formatPrice, productCategories, products } from "@/app/data/products";

const inventoryValue = products.reduce(
  (total, product) => total + (product.price ?? 0),
  0,
);

const metrics = [
  { label: "Open orders", value: "0", icon: PackageCheck },
  { label: "Active pieces", value: products.length.toString(), icon: Gem },
  {
    label: "Catalog value",
    value: formatPrice(inventoryValue),
    icon: ChartNoAxesColumnIncreasing,
  },
];

export default function AdminPage() {
  return (
    <main className="flex-1 bg-[#fbfaf7] px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
              Admin
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[#1f2a24]">Store overview</h1>
            <p className="mt-3 text-sm text-stone-600">
              {productCategories.length} curated storefront categories are
              ready for client browsing.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 w-fit items-center rounded-md bg-[#1f2a24] px-4 text-sm font-semibold text-white transition hover:bg-[#2d3b33]"
          >
            View storefront
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f7f1e8] text-[#8b6d2f]">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-medium text-stone-600">{metric.label}</p>
                <p className="mt-2 text-4xl font-semibold text-[#1f2a24]">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

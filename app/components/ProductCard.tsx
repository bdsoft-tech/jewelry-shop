import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import AddToCartButton from "@/app/components/Cart/AddToCartButton";
import {
  formatPrice,
  getCategoryName,
  getProductHref,
  type CatalogProduct,
} from "@/app/data/products";

export type ProductCardProps = {
  product: CatalogProduct;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const productHref = getProductHref(product);

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d7b56d] hover:shadow-xl hover:shadow-stone-900/10">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <Link
          href={productHref}
          className="relative block h-full"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="scale-125 object-cover transition duration-500 group-hover:scale-[1.32]"
            style={{ objectPosition: product.image.objectPosition }}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a24]/35 via-transparent to-transparent" />
        </Link>
        <button
          type="button"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-white/92 text-[#1f2a24] shadow-sm transition hover:text-[#8b1e3f]"
          aria-label={`Save ${product.name}`}
          title={`Save ${product.name}`}
        >
          <Heart size={18} aria-hidden="true" />
        </button>
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-[#8b1e3f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
            {getCategoryName(product.category)}
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-stone-700">
            <Star size={15} className="fill-[#d7b56d] text-[#d7b56d]" aria-hidden="true" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <Link
            href={productHref}
            className="block text-xl font-semibold text-[#1f2a24] transition hover:text-[#8b1e3f]"
          >
            {product.name}
          </Link>
          <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-stone-100 pt-4">
          <span className="text-lg font-semibold text-[#1f2a24]">
            {formatPrice(product.price)}
          </span>
          {product.price === null ? (
            <Link
              href={productHref}
              className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 px-3 text-sm font-semibold text-[#1f2a24] transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
            >
              Inquire
            </Link>
          ) : (
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              className="h-10 px-3"
            >
              Add
            </AddToCartButton>
          )}
        </div>
      </div>
    </article>
  );
}

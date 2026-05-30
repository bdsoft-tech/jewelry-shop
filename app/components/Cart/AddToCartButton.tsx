"use client";

import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/components/Cart/CartProvider";
import type { CatalogProduct } from "@/app/lib/catalog";

type AddToCartButtonProps = {
  productId: CatalogProduct["id"];
  productName: string;
  className?: string;
  children?: ReactNode;
};

export default function AddToCartButton({
  productId,
  productName,
  className,
  children = "Add to bag",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeoutId = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(productId);
        setAdded(true);
      }}
      className={clsx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f2a24] px-4 text-sm font-semibold text-white transition hover:bg-[#2d3b33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d]",
        className,
      )}
      aria-label={`Add ${productName} to bag`}
    >
      {added ? (
        <Check size={17} aria-hidden="true" />
      ) : (
        <ShoppingBag size={17} aria-hidden="true" />
      )}
      {added ? "Added" : children}
    </button>
  );
}

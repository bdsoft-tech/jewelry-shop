"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/components/Cart/CartProvider";

export default function CartLink() {
  const { hydrated, totalQuantity } = useCart();
  const displayQuantity = hydrated ? totalQuantity : 0;

  return (
    <Link
      href="/cart"
      className="relative flex h-10 items-center gap-2 rounded-md bg-[#1f2a24] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d3b33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d]"
      aria-label={`Shopping bag with ${displayQuantity} item${
        displayQuantity === 1 ? "" : "s"
      }`}
    >
      <ShoppingBag size={17} aria-hidden="true" />
      <span className="hidden sm:inline">Bag</span>
      {displayQuantity > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d7b56d] px-1.5 text-[11px] font-bold leading-none text-[#1f2a24]">
          {displayQuantity}
        </span>
      ) : null}
    </Link>
  );
}

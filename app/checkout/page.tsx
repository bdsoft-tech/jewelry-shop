"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gem } from "lucide-react";
import CheckoutSummary from "@/app/components/Cart/CheckoutSummary";
import { hasDemoSession } from "@/app/lib/demo-auth";

export default function CheckoutPage() {
  const router = useRouter();
  const [accessState, setAccessState] = useState<"checking" | "authorized">(
    "checking",
  );

  useEffect(() => {
    if (hasDemoSession("user")) {
      const timerId = window.setTimeout(() => {
        setAccessState("authorized");
      }, 0);

      return () => window.clearTimeout(timerId);
    }

    router.replace("/login?redirect=/checkout");
  }, [router]);

  if (accessState !== "authorized") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:px-8">
        <section className="w-full max-w-2xl rounded-[32px] border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f2a24] text-[#d7b56d]">
            <Gem size={24} aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
            Secure checkout
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1f2a24] sm:text-4xl">
            Redirecting you to sign in before checkout.
          </h1>
          <p className="mt-4 text-base leading-8 text-stone-600">
            Checkout uses a demo session stored in session storage. Sign in to
            continue with your bag.
          </p>
          <Link
            href="/login?redirect=/checkout"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
          >
            Go to sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:px-8">
      <CheckoutSummary />
    </main>
  );
}

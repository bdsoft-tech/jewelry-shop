import Link from "next/link";
import { Mail, User } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex-1 bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]">
          <User size={23} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-[#1f2a24]">Client account</h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Access saved pieces, appointment history, order documents, and jewelry care notes.
        </p>
        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">Email</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-stone-300 px-3 text-stone-500">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
            </span>
          </label>
          <button
            type="button"
            className="h-12 w-full rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
          >
            Continue
          </button>
        </form>
        <Link href="/products" className="mt-6 inline-block text-sm font-semibold text-[#8b1e3f]">
          Continue as guest
        </Link>
      </section>
    </main>
  );
}

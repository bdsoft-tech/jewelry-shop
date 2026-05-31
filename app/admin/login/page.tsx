"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { ArrowRight, Crown, Gem, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { setDemoSession } from "@/app/lib/demo-auth";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const initialValues: LoginValues = {
  email: "",
  password: "",
};

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  const email = values.email.trim();
  const password = values.password.trim();

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

function Field({
  id,
  label,
  icon,
  type,
  value,
  error,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  type: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <span
        className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 shadow-sm transition focus-within:border-[#d7b56d] focus-within:ring-2 focus-within:ring-[#d7b56d]/20 ${
          error ? "border-rose-300" : "border-stone-200"
        }`}
      >
        <span className="text-[#8b1e3f]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#1f2a24] outline-none placeholder:text-stone-400"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </span>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </label>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof LoginValues>(field: K, value: LoginValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setDemoSession("admin", values.email.trim());
    setValues(initialValues);
    setErrors({});
    router.replace("/admin");
  }

  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(215,181,109,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,30,63,0.12),_transparent_30%),linear-gradient(160deg,_#fbfaf7_0%,_#f3ece0_55%,_#fbfaf7_100%)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#d7b56d]/15 blur-3xl" />
        <div className="absolute bottom-0 right-[-7rem] h-80 w-80 rounded-full bg-[#8b1e3f]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7b56d]/40 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f] shadow-sm backdrop-blur">
            <Sparkles size={14} aria-hidden="true" />
            Admin sign in
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2a24] sm:text-5xl lg:text-6xl">
            Enter the private admin lane for the atelier.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
            This demo sign in stays in the browser with session storage only.
            No backend, API, or persistent account data is involved.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Crown className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Admin access</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Protected from the storefront until you sign in.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <LockKeyhole className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Frontend only</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Credentials are validated locally for the demo flow.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Gem className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Premium UI</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Responsive, polished, and consistent with the brand style.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/admin/signup"
              className="inline-flex items-center gap-2 font-semibold text-[#8b1e3f] transition hover:text-[#6f1732]"
            >
              Create an admin account
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <span className="text-stone-400">or</span>
            <Link href="/login" className="font-semibold text-stone-700 transition hover:text-[#8b1e3f]">
              Return to client sign in
            </Link>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(63,47,20,0.16)] backdrop-blur-xl sm:p-8">
          <div className="rounded-[24px] border border-stone-100 bg-[#fffdf9] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e3f]">
                  Admin portal
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#1f2a24]">
                  Sign in to continue
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Use your admin demo credentials to open the private catalog
                  management area.
                </p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f2a24] text-[#d7b56d] sm:flex">
                <Crown size={22} aria-hidden="true" />
              </div>
            </div>

            {Object.keys(errors).length > 0 ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800"
              >
                Please fix the highlighted fields and submit again.
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <Field
                id="admin-login-email"
                label="Email"
                type="email"
                value={values.email}
                onChange={(value) => updateField("email", value)}
                autoComplete="email"
                placeholder="admin@example.com"
                error={errors.email}
                icon={<UserRound size={16} aria-hidden="true" />}
              />

              <Field
                id="admin-login-password"
                label="Password"
                type="password"
                value={values.password}
                onChange={(value) => updateField("password", value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password}
                icon={<LockKeyhole size={16} aria-hidden="true" />}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#1f2a24,_#3a4b42)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(31,42,36,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(31,42,36,0.28)] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 text-sm leading-7 text-stone-600">
              Need to create an admin demo account?{" "}
              <Link href="/admin/signup" className="font-semibold text-[#8b1e3f] hover:text-[#6f1732]">
                Sign up here
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import {
  ArrowRight,
  Crown,
  Gem,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { setDemoSession } from "@/app/lib/demo-auth";

type SignupValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminAccessCode: string;
};

type SignupErrors = Partial<Record<keyof SignupValues, string>>;

const DEMO_ADMIN_CODE = "AURELLE-2026";

const initialValues: SignupValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  adminAccessCode: "",
};

function validate(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;
  const adminAccessCode = values.adminAccessCode.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Use a password with at least one letter and one number.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!adminAccessCode) {
    errors.adminAccessCode = "Admin access code is required.";
  } else if (adminAccessCode !== DEMO_ADMIN_CODE) {
    errors.adminAccessCode = "Use the demo access code shown on this page.";
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

export default function AdminSignupPage() {
  const router = useRouter();
  const [values, setValues] = useState<SignupValues>(initialValues);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof SignupValues>(field: K, value: SignupValues[K]) {
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
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(215,181,109,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(139,30,63,0.12),_transparent_30%),linear-gradient(160deg,_#fbfaf7_0%,_#f6efe1_48%,_#fbfaf7_100%)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-5rem] top-6 h-72 w-72 rounded-full bg-[#d7b56d]/15 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-7rem] h-80 w-80 rounded-full bg-[#8b1e3f]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="order-2 rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(63,47,20,0.16)] backdrop-blur-xl sm:p-8 lg:order-1">
          <div className="rounded-[24px] border border-stone-100 bg-[#fffdf9] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e3f]">
                  Admin access
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#1f2a24]">
                  Create an admin demo account
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  This form is fully local. It validates input on the frontend
                  and displays a success state without calling a backend.
                </p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f2a24] text-[#d7b56d] sm:flex">
                <Crown size={22} aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Demo access code: <span className="font-semibold">{DEMO_ADMIN_CODE}</span>
            </div>

            {Object.keys(errors).length > 0 ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800"
              >
                Please review the highlighted fields before continuing.
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <Field
                id="admin-name"
                label="Name"
                type="text"
                value={values.name}
                onChange={(value) => updateField("name", value)}
                autoComplete="name"
                placeholder="Ava Sterling"
                error={errors.name}
                icon={<UserRound size={16} aria-hidden="true" />}
              />

              <Field
                id="admin-email"
                label="Email"
                type="email"
                value={values.email}
                onChange={(value) => updateField("email", value)}
                autoComplete="email"
                placeholder="admin@example.com"
                error={errors.email}
                icon={<Mail size={16} aria-hidden="true" />}
              />

              <Field
                id="admin-password"
                label="Password"
                type="password"
                value={values.password}
                onChange={(value) => updateField("password", value)}
                autoComplete="new-password"
                placeholder="Create a strong password"
                error={errors.password}
                icon={<LockKeyhole size={16} aria-hidden="true" />}
              />

              <Field
                id="admin-confirm-password"
                label="Confirm password"
                type="password"
                value={values.confirmPassword}
                onChange={(value) => updateField("confirmPassword", value)}
                autoComplete="new-password"
                placeholder="Repeat your password"
                error={errors.confirmPassword}
                icon={<ShieldCheck size={16} aria-hidden="true" />}
              />

              <Field
                id="admin-access-code"
                label="Admin access code"
                type="text"
                value={values.adminAccessCode}
                onChange={(value) => updateField("adminAccessCode", value)}
                autoComplete="off"
                placeholder="Enter the demo code"
                error={errors.adminAccessCode}
                icon={<Sparkles size={16} aria-hidden="true" />}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#8b1e3f,_#b47d33)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(139,30,63,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(139,30,63,0.3)]"
              >
                {isSubmitting ? "Creating account..." : "Create admin account"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 text-sm leading-7 text-stone-600">
              Already have admin access?{" "}
              <Link href="/admin/login" className="font-semibold text-[#8b1e3f] hover:text-[#6f1732]">
                Return to admin sign in
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="order-1 lg:order-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7b56d]/40 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f] shadow-sm backdrop-blur">
            <Sparkles size={14} aria-hidden="true" />
            Admin onboarding
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2a24] sm:text-5xl lg:text-6xl">
            A refined sign up screen for the store&apos;s private admin lane.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
            Crafted for a high-end jewelry brand with soft glass panels, warm
            gold accents, and responsive layout behavior from mobile to desktop.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Crown className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Premium admin</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Built to feel like a luxury brand back office.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <ShieldCheck className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Validation first</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Errors are surfaced immediately on the frontend.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <Gem className="text-[#8b1e3f]" size={18} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#1f2a24]">Responsive detail</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Every section reflows cleanly on smaller screens.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-semibold text-[#8b1e3f] transition hover:text-[#6f1732]"
            >
              Back to user sign in
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <span className="text-stone-400">or</span>
            <Link href="/products" className="font-semibold text-stone-700 transition hover:text-[#8b1e3f]">
              View the storefront
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

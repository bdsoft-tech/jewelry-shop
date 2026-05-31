"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Gem,
  LoaderCircle,
  LockKeyhole,
  Package,
  ShieldCheck,
  Truck,
  CircleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa6";
import { SiRocket } from "react-icons/si";
import { useCatalog } from "@/app/components/Catalog/CatalogProvider";
import { useCart } from "@/app/components/Cart/CartProvider";
import {
  formatPrice,
  getProductHref,
  type CatalogProduct,
} from "@/app/lib/catalog";

type CheckoutRow = {
  product: CatalogProduct;
  quantity: number;
  lineTotal: number;
};

type PaymentMethod = "bkash" | "rocket" | "nagad" | "upay" | "card";
type WalletPaymentMethod = Exclude<PaymentMethod, "card">;
type PaymentStage = "form" | "otp" | "processing" | "success";
type ErrorState = Partial<
  Record<
    | "contactEmail"
    | "firstName"
    | "lastName"
    | "address"
    | "mobileNumber"
    | "otpCode"
    | "cardNumber"
    | "cardExpiry"
    | "cardCvc"
    | "cardHolderName",
    string
  >
>;

const paymentMethodLabels: Record<PaymentMethod, string> = {
  bkash: "bKash",
  rocket: "Rocket",
  nagad: "Nagad",
  upay: "Upay",
  card: "Visa / MasterCard",
};

const walletPaymentMethods: Array<{
  id: WalletPaymentMethod;
  tag: string;
  description: string;
}> = [
  {
    id: "bkash",
    tag: "Mobile wallet",
    description: "Fast wallet checkout with a demo OTP verification step.",
  },
  {
    id: "rocket",
    tag: "Mobile wallet",
    description: "Rocket-branded mobile checkout with a polished demo flow.",
  },
  {
    id: "nagad",
    tag: "Mobile wallet",
    description: "Warm-toned wallet payment with one-time code confirmation.",
  },
  {
    id: "upay",
    tag: "Mobile wallet",
    description: "Upay wallet payment with quick verification and success.",
  },
];

function getPaymentMethodShellClass(method: PaymentMethod) {
  switch (method) {
    case "bkash":
      return "bg-gradient-to-br from-[#ff4f9f] to-[#c2185b] text-white shadow-[0_12px_24px_rgba(194,24,91,0.2)]";
    case "rocket":
      return "border border-[#f4c7cd] bg-white text-[#e11d2e] shadow-[0_12px_24px_rgba(225,29,46,0.08)]";
    case "nagad":
      return "bg-gradient-to-br from-[#ffd87a] to-[#eb6a00] text-[#3b2100] shadow-[0_12px_24px_rgba(235,106,0,0.18)]";
    case "upay":
      return "bg-gradient-to-br from-[#94a7ff] to-[#324cff] text-white shadow-[0_12px_24px_rgba(50,76,255,0.18)]";
    case "card":
      return "border border-stone-200 bg-white text-[#1f2a24] shadow-[0_12px_24px_rgba(31,42,36,0.08)]";
  }
}

function PaymentMethodMark({ method }: { method: PaymentMethod }) {
  switch (method) {
    case "rocket":
      return <SiRocket size={20} aria-hidden="true" />;
    case "card":
      return (
        <div className="flex items-center gap-1.5">
          <FaCcVisa size={22} aria-hidden="true" />
          <FaCcMastercard size={22} aria-hidden="true" />
        </div>
      );
    case "bkash":
      return <span className="text-[11px] font-black tracking-[0.18em]">BK</span>;
    case "nagad":
      return <span className="text-[11px] font-black tracking-[0.18em]">NG</span>;
    case "upay":
      return <span className="text-[11px] font-black tracking-[0.18em]">UP</span>;
  }
}

const deliverySteps = [
  "Order placed",
  "Payment verified",
  "Jewelry packed",
  "Handed to delivery partner",
  "Delivered to customer",
];

function getDemoWalletNumber(method: Exclude<PaymentMethod, "card">) {
  switch (method) {
    case "bkash":
      return "017XXXXXXXX";
    case "rocket":
      return "018XXXXXXXX";
    case "nagad":
      return "019XXXXXXXX";
    case "upay":
      return "016XXXXXXXX";
  }
}

function isValidExpiry(value: string) {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [month, year] = value.split("/").map(Number);
  return month >= 1 && month <= 12 && year >= 0 && year <= 99;
}

function isValidCardNumber(value: string) {
  const digits = value.replace(/\s/g, "");
  return /^\d{13,19}$/.test(digits);
}

function isValidCvc(value: string) {
  return /^\d{3,4}$/.test(value);
}

export default function CheckoutSummary() {
  const { hydrated, items, clearCart } = useCart();
  const { products } = useCatalog();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [openWalletMethod, setOpenWalletMethod] =
    useState<WalletPaymentMethod | null>("bkash");
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("form");
  const [paymentRef, setPaymentRef] = useState("JWL-000000");
  const [contactEmail, setContactEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ErrorState>({});
  const [statusMessage, setStatusMessage] = useState("");

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const rows = items
    .map<CheckoutRow | null>((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
        lineTotal: (product.price ?? 0) * item.quantity,
      };
    })
    .filter((row): row is CheckoutRow => row !== null);

  const subtotal = rows.reduce((total, row) => total + row.lineTotal, 0);
  const walletMethod = paymentMethod !== "card";
  const walletDemoNumber = walletMethod
    ? getDemoWalletNumber(paymentMethod)
    : "";

  useEffect(() => {
    if (paymentStage !== "processing") {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      clearCart();
      setPaymentStage("success");
      setStatusMessage(
        `${paymentMethodLabels[paymentMethod]} payment verified. Your order is ready for packing.`,
      );
    }, 1800);

    return () => window.clearTimeout(timerId);
  }, [clearCart, paymentMethod, paymentStage]);

  function resetFieldErrors() {
    setFieldErrors({});
  }

  function validateCommonFields() {
    const nextErrors: ErrorState = {};

    if (!contactEmail.trim()) {
      nextErrors.contactEmail = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(contactEmail.trim())) {
      nextErrors.contactEmail = "Enter a valid email address.";
    }

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!address.trim()) {
      nextErrors.address = "Delivery address is required.";
    }

    return nextErrors;
  }

  function validateWalletFields() {
    const nextErrors: ErrorState = {};

    if (!mobileNumber.trim()) {
      nextErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^[0-9+\-\s]{8,20}$/.test(mobileNumber.trim())) {
      nextErrors.mobileNumber = "Enter a valid mobile number.";
    }

    return nextErrors;
  }

  function validateOtpFields() {
    const nextErrors: ErrorState = {};

    if (!otpCode.trim()) {
      nextErrors.otpCode = "OTP is required.";
    } else if (!/^\d{4,6}$/.test(otpCode.trim())) {
      nextErrors.otpCode = "Enter the 4 to 6 digit demo OTP.";
    }

    return nextErrors;
  }

  function validateCardFields() {
    const nextErrors: ErrorState = {};

    if (!cardNumber.trim()) {
      nextErrors.cardNumber = "Card number is required.";
    } else if (!isValidCardNumber(cardNumber)) {
      nextErrors.cardNumber = "Enter a valid card number.";
    }

    if (!cardExpiry.trim()) {
      nextErrors.cardExpiry = "Expiry date is required.";
    } else if (!isValidExpiry(cardExpiry)) {
      nextErrors.cardExpiry = "Use MM/YY format.";
    }

    if (!cardCvc.trim()) {
      nextErrors.cardCvc = "CVC is required.";
    } else if (!isValidCvc(cardCvc)) {
      nextErrors.cardCvc = "Enter a 3 or 4 digit CVC.";
    }

    if (!cardHolderName.trim()) {
      nextErrors.cardHolderName = "Card holder name is required.";
    }

    return nextErrors;
  }

  function submitContactForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      ...validateCommonFields(),
      ...(walletMethod ? validateWalletFields() : validateCardFields()),
    };

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setPaymentRef(`JWL-${Math.floor(100000 + Math.random() * 900000)}`);

    if (walletMethod) {
      setStatusMessage("");
      setPaymentStage("otp");
      return;
    }

    setStatusMessage("Confirming card details and preparing the payment.");
    setPaymentStage("processing");
  }

  function submitOtpForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateOtpFields();
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatusMessage("Verifying OTP and confirming the payment.");
    setPaymentStage("processing");
  }

  function handleMethodChange(method: PaymentMethod) {
    setPaymentMethod(method);
    setOpenWalletMethod(method === "card" ? null : method);
    resetFieldErrors();
    setStatusMessage("");
    setMobileNumber("");
    setOtpCode("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardHolderName("");
    setPaymentStage("form");
  }

  function handleBackToForm() {
    setPaymentStage("form");
    setStatusMessage("");
    resetFieldErrors();
  }

  function renderWalletAccordion() {
    return (
      <div className="grid gap-3">
        {walletPaymentMethods.map((method) => {
          const selected = paymentMethod === method.id;
          const expanded = openWalletMethod === method.id;

          return (
            <div
              key={method.id}
              className={`overflow-hidden rounded-[22px] border bg-white transition duration-200 ${
                selected
                  ? "border-[#8b1e3f] shadow-[0_18px_40px_rgba(139,30,63,0.08)] ring-1 ring-[#d7b56d]/30"
                  : "border-stone-200"
              }`}
            >
              <button
                type="button"
                onClick={() => handleMethodChange(method.id)}
                aria-pressed={selected}
                aria-expanded={expanded}
                className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-stone-50"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getPaymentMethodShellClass(
                      method.id,
                    )}`}
                  >
                    <PaymentMethodMark method={method.id} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#1f2a24]">
                        {paymentMethodLabels[method.id]}
                      </p>
                      {selected ? (
                        <span className="rounded-full bg-[#8b1e3f]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b1e3f]">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-stone-500">
                      {method.description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`mt-1 shrink-0 text-stone-500 transition duration-200 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded ? (
                <div className="border-t border-stone-200 bg-[#fbf7ef] p-4 text-sm leading-7 text-stone-600">
                  <div className="flex items-center gap-2 text-[#1f2a24]">
                    <PaymentMethodMark method={method.id} />
                    <p className="font-semibold">
                      {paymentMethodLabels[method.id]} wallet flow
                    </p>
                  </div>
                  <p className="mt-2">
                    {method.description} Select this wallet to continue with the
                    demo OTP verification.
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  function renderPaymentSelector() {
    return (
      <div className="rounded-[28px] border border-[#eadfca] bg-[#fbf7ef] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#1f2a24]">
              Choose a payment method
            </p>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              Mobile wallets open in an accordion. Visa and MasterCard stay as
              a card form.
            </p>
          </div>
          <span className="rounded-full border border-[#d7b56d]/40 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
            Demo only
          </span>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
              Mobile wallets
            </p>
            <div className="mt-3">{renderWalletAccordion()}</div>
          </div>

          <button
            type="button"
            onClick={() => handleMethodChange("card")}
            aria-pressed={paymentMethod === "card"}
            className={`group flex min-h-[200px] flex-col justify-between rounded-[24px] border p-4 text-left transition duration-200 ${
              paymentMethod === "card"
                ? "border-[#8b1e3f] bg-white shadow-[0_18px_40px_rgba(139,30,63,0.12)] ring-1 ring-[#d7b56d]/40"
                : "border-stone-200 bg-white/90 hover:border-[#d7b56d] hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${getPaymentMethodShellClass(
                  "card",
                )}`}
              >
                <PaymentMethodMark method="card" />
              </div>
              {paymentMethod === "card" ? (
                <span className="rounded-full bg-[#8b1e3f]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b1e3f]">
                  Selected
                </span>
              ) : null}
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-[#1f2a24]">
                {paymentMethodLabels.card}
              </p>
              <p className="mt-1 text-xs leading-6 text-stone-500">
                Enter card details to continue with demo processing.
              </p>
            </div>

            <div className="mt-4">
              <span className="inline-flex rounded-full border border-[#eadfca] bg-[#fcf8f0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
                Card payment
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  function renderWalletPaymentFields() {
    const selectedWallet = walletPaymentMethods.find(
      (method) => method.id === paymentMethod,
    );

    if (!selectedWallet) {
      return null;
    }

    return (
      <div className="grid gap-5 rounded-[24px] border border-[#eadfca] bg-[#fbf7ef] p-4 sm:p-5">
        <div className="flex items-center gap-3 text-[#1f2a24]">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${getPaymentMethodShellClass(
              paymentMethod,
            )}`}
          >
            <PaymentMethodMark method={paymentMethod} />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {paymentMethodLabels[paymentMethod]} wallet payment
            </p>
            <p className="text-xs text-stone-500">{selectedWallet.description}</p>
          </div>
        </div>

        {paymentStage === "otp" ? (
          <>
            <div className="rounded-2xl border border-dashed border-[#d9c8a1] bg-white px-4 py-3 text-sm text-stone-600">
              Wallet number:{" "}
              <span className="font-semibold text-[#1f2a24]">
                {mobileNumber}
              </span>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-[#1f2a24]">
                OTP code
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                placeholder="123456"
                className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
              />
              {fieldErrors.otpCode ? (
                <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                  {fieldErrors.otpCode}
                </p>
              ) : null}
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBackToForm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-[#1f2a24] transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Change method
              </button>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                <LockKeyhole size={16} aria-hidden="true" />
                Verify and pay
              </button>
            </div>
          </>
        ) : (
          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Mobile number
            </span>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              placeholder={walletDemoNumber}
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.mobileNumber ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.mobileNumber}
              </p>
            ) : null}
          </label>
        )}
      </div>
    );
  }

  function renderCardPaymentFields() {
    return (
      <div className="grid gap-5 rounded-[24px] border border-[#eadfca] bg-[#fbf7ef] p-4 sm:p-5">
        <div className="flex items-center gap-3 text-[#1f2a24]">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${getPaymentMethodShellClass(
              "card",
            )}`}
          >
            <PaymentMethodMark method="card" />
          </div>
          <div>
            <p className="text-sm font-semibold">Visa / MasterCard payment</p>
            <p className="text-xs text-stone-500">
              Enter card details to continue with demo processing.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Cardholder name
            </span>
            <input
              type="text"
              autoComplete="cc-name"
              value={cardHolderName}
              onChange={(event) => setCardHolderName(event.target.value)}
              placeholder="Name on card"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.cardHolderName ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.cardHolderName}
              </p>
            ) : null}
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Card number
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              placeholder="1234 1234 1234 1234"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.cardNumber ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.cardNumber}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Expiry date
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={cardExpiry}
              onChange={(event) => setCardExpiry(event.target.value)}
              placeholder="MM/YY"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.cardExpiry ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.cardExpiry}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              CVC / CVV
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cardCvc}
              onChange={(event) => setCardCvc(event.target.value)}
              placeholder="123"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.cardCvc ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.cardCvc}
              </p>
            ) : null}
          </label>
        </div>
      </div>
    );
  }

  function renderFormFields() {
    if (paymentStage === "processing") {
      return (
        <div
          className="mt-8 rounded-[28px] border border-[#eadfca] bg-[#fbf7ef] p-5 sm:p-6"
          aria-live="polite"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#8b1e3f] shadow-sm">
              <LoaderCircle
                className="animate-spin"
                size={22}
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#1f2a24]">
                  Processing payment
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
                  Demo checkout only
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                We are confirming your {paymentMethodLabels[paymentMethod]}
                {walletMethod ? " wallet OTP and payment." : " card details."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/90 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b6d2f]">
                    Method
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                    {paymentMethodLabels[paymentMethod]}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/90 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b6d2f]">
                    Reference
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                    {paymentRef}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form
        className="mt-8 grid gap-5"
        onSubmit={paymentStage === "otp" ? submitOtpForm : submitContactForm}
      >
        {renderPaymentSelector()}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Contact email
            </span>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.contactEmail ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.contactEmail}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              First name
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.firstName ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.firstName}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Last name
            </span>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.lastName ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.lastName}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1f2a24]">
              Delivery address
            </span>
            <textarea
              rows={4}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#d7b56d]/40"
            />
            {fieldErrors.address ? (
              <p className="mt-2 text-xs font-medium text-[#8b1e3f]">
                {fieldErrors.address}
              </p>
            ) : null}
          </label>
        </div>

        {walletMethod ? renderWalletPaymentFields() : renderCardPaymentFields()}

        {paymentStage === "form" ? (
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832] disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={!hydrated || rows.length === 0}
          >
            <LockKeyhole size={17} aria-hidden="true" />
            {walletMethod ? "Continue to OTP" : "Pay now"}
          </button>
        ) : null}
      </form>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e3f]">
          Secure checkout
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[#1f2a24] sm:text-4xl">
          Complete your order
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-700">
          Insured delivery, signature confirmation, and gift wrapping are
          included with eligible pieces.
        </p>

        <div className="mt-6 rounded-[24px] border border-dashed border-[#d8c7a0] bg-[#fbf7ef] p-4 text-sm leading-7 text-stone-600">
          Demo checkout only. Select a payment method, complete the wallet OTP
          or card form, and the flow advances through processing and success
          states without calling any API.
        </div>

        {paymentStage !== "success" ? (
          renderFormFields()
        ) : (
          <div className="mt-8 grid gap-5 rounded-[28px] border border-[#d8e8d4] bg-[#f4fbf2] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2f6b3d] shadow-sm">
                <Gem size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f2a24]">
                  Order confirmed
                </p>
                <p className="mt-1 text-sm leading-7 text-stone-600">
                  {statusMessage}
                </p>
              </div>
            </div>

            <div className="grid gap-4 rounded-[24px] border border-[#d8e8d4] bg-white p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6d2f]">
                  Payment method
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                  {paymentMethodLabels[paymentMethod]}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8b6d2f]">
                  Order reference
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                  {paymentRef}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#8b1e3f] px-5 text-sm font-semibold text-white transition hover:bg-[#741832]"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPaymentStage("form");
                  setStatusMessage("");
                  resetFieldErrors();
                  setMobileNumber("");
                  setOtpCode("");
                  setCardNumber("");
                  setCardExpiry("");
                  setCardCvc("");
                  setCardHolderName("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-semibold text-[#1f2a24] transition hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
              >
                Start another payment
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-[#1f2a24]">
          <ShieldCheck size={22} aria-hidden="true" />
          <h2 className="text-xl font-semibold">Protected purchase</h2>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          Your selected pieces are prepared with insured delivery, signature
          confirmation, and jewelry documentation.
        </p>

        <div className="mt-6 rounded-[24px] border border-[#eadfca] bg-[#fbf7ef] p-4">
          <div className="flex items-center gap-3 text-[#1f2a24]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#8b1e3f] shadow-sm">
              <Package size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Delivery history</p>
              <p className="text-xs text-stone-500">
                Demo order status after payment
              </p>
            </div>
          </div>

          <ol className="mt-4 space-y-3">
            {deliverySteps.map((step, index) => {
              const completed = paymentStage === "success" ? index < 2 : index === 0;

              return (
                <li key={step} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      completed
                        ? "border-[#2f6b3d] bg-[#2f6b3d] text-white"
                        : "border-stone-300 bg-white text-stone-500"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={14} aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f2a24]">{step}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {completed
                        ? "Completed in the demo flow."
                        : "Pending after payment verification."}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 border-t border-stone-200 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b6d2f]">
            Bag summary
          </h3>

          {hydrated && rows.length > 0 ? (
            <div className="mt-5 divide-y divide-stone-200">
              {rows.map(({ product, quantity, lineTotal }) => (
                <div key={product.id} className="flex gap-4 py-4 first:pt-0">
                  <Link
                    href={getProductHref(product)}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{ objectPosition: product.image.objectPosition }}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={getProductHref(product)}
                      className="block truncate text-sm font-semibold text-[#1f2a24] transition hover:text-[#8b1e3f]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-stone-500">
                      Quantity {quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2a24]">
                      {product.price === null
                        ? "Consultation item"
                        : formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-stone-300 p-5 text-sm leading-6 text-stone-600">
              Your bag is empty.{" "}
              <Link
                href="/products"
                className="font-semibold text-[#8b1e3f] transition hover:text-[#741832]"
              >
                Browse jewelry
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 text-lg font-semibold text-[#1f2a24]">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#eadfca] bg-[#fbf7ef] p-4 text-sm leading-7 text-stone-600">
          <div className="flex items-center gap-2 text-[#1f2a24]">
            <CircleAlert size={16} aria-hidden="true" />
            <p className="font-semibold">Important note</p>
          </div>
          <p className="mt-2">
            This checkout is a front-end demo only. It does not send payment
            data anywhere, store it locally, or connect to a gateway.
          </p>
        </div>

        {paymentStage !== "success" ? (
          <div className="mt-5 rounded-[24px] border border-[#eadfca] bg-[#fbf7ef] p-4 text-sm leading-7 text-stone-600">
            <div className="flex items-center gap-2 text-[#1f2a24]">
              <Truck size={16} aria-hidden="true" />
              <p className="font-semibold">Delivery flow</p>
            </div>
            <p className="mt-2">
              Once payment is verified, the order progresses through packing,
              handoff, and final delivery.
            </p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

import { Suspense } from "react";
import LoginForm from "./login-form";

function LoginFallback() {
  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(215,181,109,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,30,63,0.12),_transparent_30%),linear-gradient(160deg,_#fbfaf7_0%,_#f3ece0_55%,_#fbfaf7_100%)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="relative mx-auto grid min-h-[60vh] max-w-6xl place-items-center">
        <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-4 text-sm font-medium text-stone-600 shadow-[0_24px_80px_rgba(63,47,20,0.16)] backdrop-blur-xl">
          Loading sign-in form...
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader showNav={false} secondaryCta={{ href: "/", label: "Home" }} primaryCta={{ href: "/get-started", label: "Get started" }} />
      <main className="bg-grid bg-glow">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6">
            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              ← Back
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-soft backdrop-blur">
            <div className="animate-fade-up inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              Step 1 of 2
            </div>
            <h1 className="anim-delay-1 animate-fade-up mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Choose login type
            </h1>
            <p className="anim-delay-2 animate-fade-up mt-2 text-sm text-slate-600">
              Select Student or Admin. The next page is a single animated login form.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                href="/login?mode=student"
                className="group animate-fade-up rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Student</div>
                    <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Login as Student</div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-900" />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  Continue
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </Link>

              <Link
                href="/login?mode=admin&next=/admin"
                className="group animate-fade-up rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Admin</div>
                    <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Login as Admin</div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-900/90" />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  Continue
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

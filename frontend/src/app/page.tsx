import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader showNav={false} showSecondary={false} primaryCta={{ href: "/get-started", label: "Get started" }} />

      <main className="bg-grid bg-glow">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="animate-fade-up inline-flex items-center rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                AI‑Powered • Secure auth • Analytics from DB
              </div>

              <h1 className="anim-delay-1 animate-fade-up mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
                Student Learning &
                <span className="block text-slate-700">Assessment Platform</span>
              </h1>

              <p className="anim-delay-2 animate-fade-up mt-4 max-w-xl text-sm leading-6 text-slate-600">
                Students take subject‑wise MCQ quizzes and track progress. Admins manage question banks and keep
                quizzes always ready.
              </p>

              <div className="anim-delay-3 animate-fade-up mt-7">
                <Link
                  href="/get-started"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
                >
                  Get started
                </Link>
              </div>
            </div>

            <div className="animate-float rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft backdrop-blur">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                <div className="text-xs font-semibold text-white/70">Product preview</div>
                <div className="mt-2 text-xl font-extrabold">Clean dashboards, fast quizzes</div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Student</div>
                    <div className="mt-1 text-xs text-white/70">Attempt quizzes • View results • Analytics</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Admin</div>
                    <div className="mt-1 text-xs text-white/70">Create questions • Maintain subjects</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700">Quick setup</div>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                  <li>Create an admin (setup key) and add questions.</li>
                  <li>Students register and start quizzes.</li>
                  <li>Results + analytics update automatically.</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

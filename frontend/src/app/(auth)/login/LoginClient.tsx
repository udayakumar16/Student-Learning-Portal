"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { setTokenCookie } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function LoginClient({ nextPath, mode }: { nextPath?: string; mode?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminIntent = mode === "admin" || Boolean(nextPath && nextPath.startsWith("/admin"));
  const studentIntent = mode === "student";
  const loginBgVideo = process.env.NEXT_PUBLIC_LOGIN_BG_VIDEO;

  const formTitle = adminIntent ? "Admin sign in" : studentIntent ? "Student sign in" : "Sign in";
  const formSubtitle = adminIntent ? "Admin credentials required to continue." : "Enter your credentials to continue.";
  const pill = adminIntent ? "Admin access" : studentIntent ? "Student access" : null;
  const accentBarClass = adminIntent
    ? "bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400"
    : studentIntent
      ? "bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"
      : "bg-gradient-to-r from-slate-900 to-slate-700";
  const submitVariant = adminIntent ? "danger" : "primary";
  const submitText = adminIntent ? "Sign in as Admin" : "Sign in";

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader
        primaryCta={{ href: "/get-started", label: "Get started" }}
        secondaryCta={{ href: "/register", label: "Create account" }}
      />

      <main className="relative overflow-hidden bg-slate-950 text-white bg-grid">
        {/* Background layer: optional video + animated glow */}
        <div className="pointer-events-none absolute inset-0">
          {loginBgVideo ? (
            <video className="absolute inset-0 h-full w-full object-cover opacity-50" autoPlay muted loop playsInline>
              <source src={loginBgVideo} />
            </video>
          ) : null}
          <div className="absolute inset-0 auth-aurora" />
          <div className="absolute -left-24 -top-28 h-[520px] w-[520px] auth-blob auth-blob-1" />
          <div className="absolute -right-28 top-10 h-[560px] w-[560px] auth-blob auth-blob-2" />
          <div className="absolute left-1/3 -bottom-40 h-[620px] w-[620px] auth-blob auth-blob-3" />

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/75 to-slate-950" />
          <div className="absolute inset-0 auth-noise mix-blend-overlay" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="animate-fade-up inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 shadow-soft backdrop-blur">
              {adminIntent
                ? "Admin portal • Secure access"
                : studentIntent
                  ? "Student portal • Quick sign in"
                  : "One login • Student + Admin access"}
            </div>
            <h1 className="anim-delay-1 animate-fade-up mt-4 text-4xl font-extrabold tracking-tight text-white">
              {adminIntent ? "Welcome, Admin" : "Welcome back"}
              <span className="block text-white/75">Sign in to continue.</span>
            </h1>
            <p className="anim-delay-2 animate-fade-up mt-3 max-w-md text-sm leading-6 text-white/70">
              {adminIntent
                ? "Sign in with an admin account to manage the question bank and keep assessments ready."
                : "Use the same login for both roles. We’ll route you to the correct portal automatically."}
            </p>

            <div className="anim-delay-3 animate-fade-up mt-6 grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 shadow-soft backdrop-blur">
                <div className="text-sm font-extrabold text-white">Student portal</div>
                <div className="mt-1 text-xs font-semibold text-white/70">Assessments • Results • Analytics</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 shadow-soft backdrop-blur">
                <div className="text-sm font-extrabold text-white">Admin panel</div>
                <div className="mt-1 text-xs font-semibold text-white/70">Create & manage question bank</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-soft backdrop-blur">
            <div className={cn("h-1.5 w-full rounded-full", accentBarClass)} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{formTitle}</h2>
                <p className="mt-1 text-sm text-slate-600">{formSubtitle}</p>
              </div>
              {pill ? (
                <div
                  className={cn(
                    "mt-4 rounded-full border px-3 py-1 text-xs font-semibold",
                    adminIntent ? "border-rose-200 bg-rose-600 text-white" : "border-slate-200 bg-white text-slate-900"
                  )}
                >
                  {pill}
                </div>
              ) : null}
            </div>

            {adminIntent ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div className="text-xs font-semibold text-rose-900">Admin only</div>
                <div className="mt-1 text-xs text-rose-800">Only admin accounts can continue to the admin panel.</div>
              </div>
            ) : null}

            {error ? (
              <Alert className="mt-4" variant="danger">
                {error}
              </Alert>
            ) : null}

            <form
              className="mt-5 flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setLoading(true);
                try {
                  const data = await apiFetch<{ token: string; user?: { role?: string } }>("/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, password })
                  });
                  setTokenCookie(data.token);

                  const role = data.user?.role ?? "student";

                  if (adminIntent) {
                    if (role !== "admin") {
                      setError("This account is not an admin.");
                      return;
                    }
                    router.replace(nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin");
                    return;
                  }

                  if (studentIntent) {
                    router.replace("/dashboard");
                    return;
                  }

                  router.replace(role === "admin" ? "/admin" : "/dashboard");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Login failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@college.edu"
                required
              />

              <Input
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />

              <Button disabled={loading} type="submit" className="mt-2 w-full" variant={submitVariant}>
                {loading ? "Signing in..." : submitText}
              </Button>
            </form>

            <div className="mt-5 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {adminIntent ? (
                  <>
                    Need student login?{" "}
                    <Link className="font-semibold text-slate-900 underline" href="/login?mode=student">
                      Switch to Student
                    </Link>
                  </>
                ) : (
                  <>
                    New student?{" "}
                    <Link className="font-semibold text-slate-900 underline" href="/register">
                      Create account
                    </Link>
                  </>
                )}
              </span>
              <Link className="font-semibold text-slate-900 hover:underline" href="/get-started">
                Back to choose login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

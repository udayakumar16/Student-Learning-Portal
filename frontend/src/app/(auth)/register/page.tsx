"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { setTokenCookie } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    department: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader
        primaryCta={{ href: "/login", label: "Login" }}
        secondaryCta={{ href: "/get-started", label: "Get started" }}
      />

      <main className="bg-grid">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              Create your student account
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
              Start learning smarter
              <span className="block text-slate-700">in minutes.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Register once and access assessments, results, analytics, and support.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">What you get</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>• Subject-wise quizzes (Python, AI, DBMS)</li>
                <li>• Results with review</li>
                <li>• Analytics charts</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-extrabold">Student Signup</h2>
            <p className="mt-1 text-sm text-slate-600">Create your account to start.</p>

          {error ? <Alert className="mt-4" variant="danger">{error}</Alert> : null}

          <form
            className="mt-5 grid grid-cols-1 gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const data = await apiFetch<{ token: string }>("/api/auth/register", {
                  method: "POST",
                  body: JSON.stringify(form)
                });
                setTokenCookie(data.token);
                router.replace("/dashboard");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Signup failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              required
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Register Number"
                value={form.registerNumber}
                onChange={(e) => setForm((f) => ({ ...f, registerNumber: e.target.value }))}
                placeholder="e.g., 21CS001"
                required
              />
              <Input
                label="Department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="e.g., CSE"
                required
              />
            </div>

            <Input
              label="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              type="email"
              placeholder="you@college.edu"
              required
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                placeholder="e.g., 9876543210"
                required
              />
              <Input
                label="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                type="password"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <Button disabled={loading} type="submit" className="mt-2 w-full">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

            <p className="mt-4 text-sm text-slate-600">
              Already have an account?{" "}
              <Link className="font-semibold text-slate-900 underline" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

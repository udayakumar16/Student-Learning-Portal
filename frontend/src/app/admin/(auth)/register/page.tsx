"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch } from "@/lib/api";
import { setTokenCookie } from "@/lib/auth";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              ← Home
            </Link>
            <div className="flex items-center gap-3">
                <Link href="/login?next=/admin" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                  Back to Login
              </Link>
              <Link href="/get-started" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                Get Started
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-soft">
              <div className="text-xs font-semibold text-white/70">ADMIN</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Create an Admin Account</h1>
              <p className="mt-2 text-sm text-white/70">
                Protected by an Admin Setup Key to prevent public signups.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/80">Where do I get the key?</div>
                <div className="mt-1 text-xs text-white/70">
                  Set `ADMIN_SETUP_KEY` in the backend `.env` and restart the backend.
                </div>
              </div>
            </div>

            <Card className="shadow-soft">
            <div className="text-sm font-semibold text-slate-900">Admin Signup</div>
            <div className="mt-1 text-xs text-slate-500">Create account and open the admin panel.</div>

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
                  const data = await apiFetch<{ token: string }>("/api/admin/register", {
                    method: "POST",
                    body: JSON.stringify({ name, email, password, setupKey })
                  });

                  setTokenCookie(data.token);
                  router.replace("/admin");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Signup failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
              />
              <Input
                label="Admin Setup Key"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                placeholder="Ask your developer / IT admin"
                required
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create admin account"}
              </Button>

              <div className="text-xs text-slate-500">
                Already have an admin account?{" "}
                  <Link href="/login?next=/admin" className="font-semibold text-slate-900 hover:underline">
                    Sign in
                </Link>
              </div>
            </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

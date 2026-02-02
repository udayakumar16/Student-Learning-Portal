"use client";

import { AdminShell } from "@/components/AdminShell";
import { apiFetch } from "@/lib/api";
import { clearTokenCookie, getTokenFromCookie } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) {
      router.replace("/login?mode=admin&next=/admin");
      return;
    }

    let alive = true;

    apiFetch<{ user: { role?: string } }>("/api/users/me")
      .then((data) => {
        if (!alive) return;
        if (data.user?.role !== "admin") {
          clearTokenCookie();
          router.replace("/login?mode=admin&next=/admin");
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!alive) return;
        clearTokenCookie();
        router.replace("/login?mode=admin&next=/admin");
      });

    return () => {
      alive = false;
    };
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Loading admin panel...</div>
            <div className="mt-1 text-sm text-slate-600">Checking your admin access.</div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

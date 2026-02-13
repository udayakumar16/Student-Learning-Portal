"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokenCookie } from "@/lib/auth";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/subjects", label: "Subjects" },
  { href: "/admin/questions", label: "Questions" }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  return (
    <aside className="flex h-full w-full flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <div className="text-sm font-extrabold">Admin Panel</div>
        <div className="mt-1 text-xs text-white/70">Manage quizzes & questions</div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm ${
                active ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        {!confirming ? (
          <Button className="w-full" variant="secondary" onClick={() => setConfirming(true)}>
            Logout
          </Button>
        ) : (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 text-sm font-semibold">Confirm logout?</div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  clearTokenCookie();
                  router.replace("/login?mode=admin&next=/admin");
                }}
              >
                Yes
              </Button>
              <Button className="flex-1" variant="secondary" onClick={() => setConfirming(false)}>
                No
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-grid bg-glow">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-soft backdrop-blur md:hidden">
          <div>
            <div className="text-sm font-semibold text-slate-900">Admin Panel</div>
            <div className="text-xs text-slate-500">Question management</div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Menu
          </Button>
        </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
            <div className="hidden md:block md:sticky md:top-4 md:h-[calc(100vh-2rem)]">
              <AdminSidebar />
            </div>
            <main className="min-h-[calc(100vh-2rem)]">{children}</main>
          </div>
        </div>
      </div>

      <div className={cn("fixed inset-0 z-50 md:hidden", open ? "block" : "hidden")}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Menu</div>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
          <AdminSidebar />
        </div>
      </div>
    </div>
  );
}

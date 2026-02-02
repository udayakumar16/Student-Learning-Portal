"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { getTokenFromCookie } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) router.replace("/login");
  }, [router, pathname]);

  return <DashboardShell>{children}</DashboardShell>;
}

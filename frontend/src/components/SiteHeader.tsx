import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteHeader({
  primaryCta = { href: "/get-started", label: "Get started" },
  secondaryCta = { href: "/login", label: "Login" },
  showNav = true,
  showSecondary = true
}: {
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  showNav?: boolean;
  showSecondary?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Brand />

        {showNav ? (
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/get-started" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Get started
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Dashboard
            </Link>
          </nav>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {showSecondary ? (
            <Link
              href={secondaryCta.href}
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:inline-flex"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
          <Link
            href={primaryCta.href}
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}

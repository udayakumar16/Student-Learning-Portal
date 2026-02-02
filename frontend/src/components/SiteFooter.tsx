import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Student Learning Platform</div>
          <div className="text-xs text-slate-500">Learning • Assessment • Analytics</div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
          <Link className="hover:text-slate-900" href="/get-started">
            Get started
          </Link>
          <Link className="hover:text-slate-900" href="/login">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

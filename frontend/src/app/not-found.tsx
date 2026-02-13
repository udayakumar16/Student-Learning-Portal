import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center gap-4 px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-500">404</div>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you’re looking for doesn’t exist (or was moved).</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Go home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}

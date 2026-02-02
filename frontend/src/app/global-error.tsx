"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Global error</div>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">App crashed during rendering</h1>
            <p className="mt-2 text-sm text-slate-600">
              This is the global error boundary. Clicking retry will attempt to recover.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Reload page
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-500">Details (dev)</div>
              <div className="mt-1 break-words font-mono text-xs text-slate-700">{error.message || "Unknown error"}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

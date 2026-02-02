"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center gap-4 px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-500">Something went wrong</div>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">We hit an unexpected error</h1>
        <p className="mt-2 text-sm text-slate-600">
          Try refreshing this section. If it keeps happening, restart the dev server and confirm you’re on a supported Node.js
          version.
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
  );
}

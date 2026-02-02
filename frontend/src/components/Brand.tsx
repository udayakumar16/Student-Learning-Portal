import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10">
        <span className="text-sm font-extrabold tracking-tight">SL</span>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold tracking-tight text-slate-900">
          Student Learning
        </span>
        <span className="block text-xs font-semibold text-slate-500">Assessment Platform</span>
      </span>
    </Link>
  );
}

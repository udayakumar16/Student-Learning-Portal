import { cn } from "@/lib/cn";

export function Card({
  title,
  children,
  className
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/70",
        className
      )}
    >
      {title ? <h2 className="mb-3 text-base font-extrabold tracking-tight text-slate-900">{title}</h2> : null}
      {children}
    </div>
  );
}

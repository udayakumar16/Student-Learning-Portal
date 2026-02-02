import { cn } from "@/lib/cn";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Select({ className, label, hint, error, id, children, ...props }: Props) {
  const selectId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10",
          error ? "border-red-300 focus:border-red-400 focus:ring-red-500/10" : "border-slate-200",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error ? <div className="text-xs font-medium text-red-700">{error}</div> : null}
      {!error && hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

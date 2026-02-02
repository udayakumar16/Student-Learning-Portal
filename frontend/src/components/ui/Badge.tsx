import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  variant?: "success" | "danger" | "neutral";
  className?: string;
};

export function Badge({ children, variant = "neutral", className }: Props) {
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-red-100 text-red-800"
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}

import { cn } from "@/lib/cn";

export function Alert({
  children,
  variant = "info",
  className
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "danger";
  className?: string;
}) {
  const variants: Record<"info" | "success" | "danger", string> = {
    info: "border-slate-200 bg-white text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    danger: "border-red-200 bg-red-50 text-red-800"
  };

  return <div className={cn("rounded-lg border p-3 text-sm", variants[variant], className)}>{children}</div>;
}

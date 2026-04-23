import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  children?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus-visible:ring-slate-900/40 shadow-sm",
  secondary:
    "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-900/30",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-900/30",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/40 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  leadingIcon,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

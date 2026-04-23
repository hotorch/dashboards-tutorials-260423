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
  "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-indigo-500 to-indigo-400 text-white hover:from-indigo-500 hover:to-indigo-500 hover:shadow-[0_0_24px_rgba(99,102,241,0.35)] active:from-indigo-600 active:to-indigo-500 focus-visible:ring-indigo-500/50",
  secondary:
    "bg-transparent text-fg ring-1 ring-border-subtle hover:bg-surface-hover hover:ring-border-strong focus-visible:ring-indigo-500/40",
  ghost:
    "bg-transparent text-fg-muted hover:bg-surface-hover hover:text-fg focus-visible:ring-indigo-500/40",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500/50 shadow-sm",
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

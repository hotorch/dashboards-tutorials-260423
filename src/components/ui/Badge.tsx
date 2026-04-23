import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${className}`}
    >
      {children}
    </span>
  );
}

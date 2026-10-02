import type { ReactNode } from "react";
import type { BadgeTone } from "../../types";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ children, dot = false, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
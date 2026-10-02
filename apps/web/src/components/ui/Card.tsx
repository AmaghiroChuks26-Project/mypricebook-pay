import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div";
}

export function Card({ as: Element = "section", children, className = "", ...props }: CardProps) {
  return (
    <Element className={`surface ${className}`} {...props}>
      {children}
    </Element>
  );
}
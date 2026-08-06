import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  id?: string;
}

export function Card({
  children,
  className = "",
  as: Tag = "div",
  id,
}: CardProps) {
  return (
    <Tag
      id={id}
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </Tag>
  );
}

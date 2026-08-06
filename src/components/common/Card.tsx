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
      className={`glass-panel ui-rise rounded-[var(--radius-xl)] ${className}`}
    >
      {children}
    </Tag>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
}

export function IconButton({
  label,
  children,
  active = false,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        active
          ? "border-[var(--color-ocean-400)] bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const buttonVariants: Record<NonNullable<TextButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--color-ocean-600)] text-white hover:bg-[var(--color-ocean-700)] shadow-sm",
  secondary:
    "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]",
};

export function TextButton({
  children,
  variant = "secondary",
  className = "",
  ...props
}: TextButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

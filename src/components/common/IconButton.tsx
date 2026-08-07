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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] shadow-[var(--shadow-soft)]"
          : "border-[var(--color-border)] bg-white/80 text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-strong)]"
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
    "bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-white shadow-[0_12px_28px_-14px_rgba(11,36,71,0.55)] hover:brightness-105",
  secondary:
    "border border-[var(--color-border)] bg-white/80 text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-accent-soft)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-strong)]",
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
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

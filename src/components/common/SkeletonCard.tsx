import { Card } from "@/components/common/Card";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <Card
      className={`animate-pulse space-y-3 p-4 ${className}`}
      aria-hidden
    >
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="h-6 w-2/3 rounded bg-slate-200" />
      <div className="h-28 w-full rounded-[var(--radius-md)] bg-slate-100" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
        <div className="h-6 w-20 rounded-full bg-slate-200" />
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
    </Card>
  );
}

"use client";

import type { ActivityExecutionItem } from "@/types/activity";
import { ActivityItemCard } from "@/components/activity/ActivityItemCard";

type Props = {
  items: ActivityExecutionItem[];
  onSelectItem?: (itemId: string) => void;
};

export function ActivityItemList({ items, onSelectItem }: Props) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section aria-label="전체 일정">
      <h3 className="text-sm font-bold text-slate-900">전체 일정</h3>
      <ul className="mt-2 space-y-2">
        {sorted.map((item) => (
          <li key={item.id}>
            <ActivityItemCard
              item={item}
              onSelect={
                onSelectItem ? () => onSelectItem(item.id) : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

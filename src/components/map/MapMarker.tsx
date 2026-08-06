"use client";

import type { ReactNode } from "react";
import {
  Fish,
  Footprints,
  Leaf,
  ShoppingBasket,
  Trash2,
  Waves,
} from "lucide-react";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { MapCategory } from "@/types/map";

const categoryIcons: Record<MapCategory, ReactNode> = {
  fishing: <Fish className="h-3.5 w-3.5" />,
  tide: <Waves className="h-3.5 w-3.5" />,
  market: <ShoppingBasket className="h-3.5 w-3.5" />,
  uglySeafood: <Leaf className="h-3.5 w-3.5" />,
  trash: <Trash2 className="h-3.5 w-3.5" />,
  plogging: <Footprints className="h-3.5 w-3.5" />,
};

interface MapMarkerProps {
  category: MapCategory;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  onClick?: () => void;
}

export function MapMarker({
  category,
  label,
  x,
  y,
  selected = false,
  onClick,
}: MapMarkerProps) {
  const color = CATEGORY_COLORS[category];

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white p-1.5 text-white shadow-md transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        selected ? "scale-125 ring-2 ring-white/80 ring-offset-2" : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        boxShadow: selected
          ? `0 0 0 2px ${color}, 0 4px 12px rgba(15, 23, 42, 0.2)`
          : undefined,
      }}
    >
      {categoryIcons[category]}
    </button>
  );
}

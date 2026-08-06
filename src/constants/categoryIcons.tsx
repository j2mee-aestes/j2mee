import type { ReactNode } from "react";
import {
  Fish,
  Footprints,
  LayoutGrid,
  ShoppingBasket,
  Trash2,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import type { CategoryFilter, MapCategory } from "@/types/map";

export function getCategoryIcon(
  category: CategoryFilter,
  className = "h-4 w-4",
): ReactNode {
  const icons: Record<CategoryFilter, ReactNode> = {
    all: <LayoutGrid className={className} />,
    fishing: <Fish className={className} />,
    tide: <Waves className={className} />,
    market: <ShoppingBasket className={className} />,
    restaurant: <UtensilsCrossed className={className} />,
    trash: <Trash2 className={className} />,
    plogging: <Footprints className={className} />,
  };
  return icons[category];
}

export function getMapCategoryIcon(
  category: MapCategory,
  className = "h-3.5 w-3.5",
): ReactNode {
  return getCategoryIcon(category, className);
}

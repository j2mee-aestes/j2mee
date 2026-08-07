import type { ReactNode } from "react";
import {
  Bike,
  CalendarDays,
  Fish,
  Footprints,
  LayoutGrid,
  ShoppingBasket,
  Star,
  Trash2,
} from "lucide-react";
import type { CategoryFilter, MapCategory } from "@/types/map";

export function getCategoryIcon(
  category: CategoryFilter,
  className = "h-4 w-4",
): ReactNode {
  const icons: Record<CategoryFilter, ReactNode> = {
    all: <LayoutGrid className={className} />,
    fishing: <Fish className={className} />,
    market: <ShoppingBasket className={className} />,
    restaurant: <ShoppingBasket className={className} />,
    trash: <Trash2 className={className} />,
    plogging: <Footprints className={className} />,
    attraction: <Star className={className} />,
    leisure: <Bike className={className} />,
    event: <CalendarDays className={className} />,
  };
  return icons[category];
}

export function getMapCategoryIcon(
  category: MapCategory,
  className = "h-3.5 w-3.5",
): ReactNode {
  return getCategoryIcon(category, className);
}

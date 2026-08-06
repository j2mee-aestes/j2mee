import { CATEGORY_COLORS } from "@/constants/categories";
import type { MapCategory, MapLocation } from "@/types/map";

const CATEGORY_SYMBOL: Record<MapCategory, string> = {
  fishing: "🎣",
  tide: "🌊",
  market: "🛒",
  restaurant: "🍽",
  uglySeafood: "🐟",
  trash: "♻️",
  plogging: "👟",
};

export function createMarkerContent(
  location: MapLocation,
  selected: boolean,
  onSelect: (id: string) => void,
): HTMLElement {
  const color = CATEGORY_COLORS[location.category];
  const wrapper = document.createElement("div");
  wrapper.className = "padopado-marker";
  wrapper.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-4px);
    cursor: pointer;
  `;

  if (selected) {
    const label = document.createElement("div");
    label.textContent = location.name;
    label.style.cssText = `
      max-width: 140px;
      margin-bottom: 6px;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #fff;
      color: #0f172a;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.3;
      box-shadow: 0 4px 12px rgba(15,23,42,0.12);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    wrapper.appendChild(label);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", location.name);
  button.setAttribute("aria-pressed", selected ? "true" : "false");
  button.style.cssText = `
    width: ${selected ? "36px" : "30px"};
    height: ${selected ? "36px" : "30px"};
    border-radius: 9999px;
    border: 2px solid #fff;
    background: ${color};
    color: #fff;
    box-shadow: ${
      selected
        ? `0 0 0 2px ${color}, 0 6px 14px rgba(15,23,42,0.25)`
        : "0 4px 10px rgba(15,23,42,0.18)"
    };
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${selected ? "15px" : "13px"};
    line-height: 1;
    cursor: pointer;
    transition: transform 120ms ease;
  `;
  button.textContent = CATEGORY_SYMBOL[location.category];
  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.08)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
  });
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect(location.id);
  });

  wrapper.appendChild(button);
  return wrapper;
}

export function createUserLocationContent(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    border: 3px solid #fff;
    background: #2563eb;
    box-shadow: 0 0 0 6px rgba(37,99,235,0.25), 0 4px 10px rgba(15,23,42,0.2);
  `;
  wrapper.setAttribute("aria-label", "현재 위치");
  return wrapper;
}

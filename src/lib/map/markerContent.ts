import { CATEGORY_COLORS } from "@/constants/categories";
import { WASTE_MARKER_COLORS } from "@/constants/environmentData";
import { PARTNER_MARKER_COLORS } from "@/constants/partners";
import { FISHING_ALLOWED_COLORS } from "@/constants/safetyThresholds";
import type { MapCategory, MapLocation } from "@/types/map";

const CATEGORY_SYMBOL: Record<MapCategory, string> = {
  fishing: "🎣",
  tide: "🌊",
  market: "🛒",
  restaurant: "🍽",
  trash: "♻️",
  plogging: "👟",
};

const WASTE_SYMBOL: Record<string, string> = {
  generalTrash: "🗑",
  recycling: "♻️",
  fishingLine: "🧵",
  fishingGear: "⚓",
  ploggingCollection: "📦",
  other: "♻️",
};

function resolveMarkerColor(location: MapLocation): string {
  if (location.category === "fishing" && location.fishingAllowedStatus) {
    return FISHING_ALLOWED_COLORS[location.fishingAllowedStatus];
  }
  if (location.partnerType) {
    return PARTNER_MARKER_COLORS[location.partnerType];
  }
  if (location.wastePointType) {
    if (
      location.wasteStatus === "removed" ||
      location.wasteStatus === "temporarilyUnavailable"
    ) {
      return "#94a3b8";
    }
    return WASTE_MARKER_COLORS[location.wastePointType];
  }
  return CATEGORY_COLORS[location.category];
}

function resolveMarkerSymbol(location: MapLocation): string {
  if (location.partnerType === "processingShop") {
    return "🔪";
  }
  if (location.wastePointType) {
    return WASTE_SYMBOL[location.wastePointType] ?? CATEGORY_SYMBOL.trash;
  }
  return CATEGORY_SYMBOL[location.category];
}

export function createMarkerContent(
  location: MapLocation,
  selected: boolean,
  onSelect: (id: string) => void,
): HTMLElement {
  const color = resolveMarkerColor(location);
  const unavailable =
    location.wasteStatus === "removed" ||
    location.wasteStatus === "temporarilyUnavailable";
  const wrapper = document.createElement("div");
  wrapper.className = "padopado-marker";
  wrapper.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-4px);
    cursor: pointer;
    opacity: ${unavailable ? "0.55" : "1"};
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
  const statusHint =
    location.category === "fishing" && location.fishingAllowedStatus
      ? ` (${location.fishingAllowedStatus})`
      : location.wasteStatus
        ? ` (${location.wasteStatus})`
        : "";
  button.setAttribute("aria-label", `${location.name}${statusHint}`);
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
    ${unavailable ? "filter: grayscale(0.4);" : ""}
  `;
  button.textContent = resolveMarkerSymbol(location);
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
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onSelect(location.id);
    }
  });

  wrapper.appendChild(button);

  if (location.category === "fishing" && location.fishingAllowedStatus === "prohibited") {
    const badge = document.createElement("span");
    badge.textContent = "금지";
    badge.style.cssText = `
      margin-top: 4px;
      padding: 1px 5px;
      border-radius: 9999px;
      background: #fee2e2;
      color: #b91c1c;
      font-size: 9px;
      font-weight: 700;
    `;
    wrapper.appendChild(badge);
  } else if (
    location.category === "fishing" &&
    location.fishingAllowedStatus === "restricted"
  ) {
    const badge = document.createElement("span");
    badge.textContent = "제한";
    badge.style.cssText = `
      margin-top: 4px;
      padding: 1px 5px;
      border-radius: 9999px;
      background: #ffedd5;
      color: #c2410c;
      font-size: 9px;
      font-weight: 700;
    `;
    wrapper.appendChild(badge);
  } else if (location.wasteStatus === "removed") {
    const badge = document.createElement("span");
    badge.textContent = "철거";
    badge.style.cssText = `
      margin-top: 4px;
      padding: 1px 5px;
      border-radius: 9999px;
      background: #e2e8f0;
      color: #475569;
      font-size: 9px;
      font-weight: 700;
    `;
    wrapper.appendChild(badge);
  } else if (location.wasteStatus === "temporarilyUnavailable") {
    const badge = document.createElement("span");
    badge.textContent = "불가";
    badge.style.cssText = `
      margin-top: 4px;
      padding: 1px 5px;
      border-radius: 9999px;
      background: #ffedd5;
      color: #c2410c;
      font-size: 9px;
      font-weight: 700;
    `;
    wrapper.appendChild(badge);
  }

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

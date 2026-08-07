import { CATEGORY_COLORS } from "@/constants/categories";
import { WASTE_MARKER_COLORS } from "@/constants/environmentData";
import { PARTNER_MARKER_COLORS } from "@/constants/partners";
import { FISHING_ALLOWED_COLORS } from "@/constants/safetyThresholds";
import type { MapCategory, MapLocation } from "@/types/map";

/** Single-letter marks — cleaner than emoji on an ocean-styled map. */
const CATEGORY_MARK: Record<MapCategory, string> = {
  fishing: "낚",
  market: "시",
  restaurant: "식",
  trash: "수",
  plogging: "플",
  attraction: "관",
  leisure: "레",
  event: "행",
};

const WASTE_MARK: Record<string, string> = {
  generalTrash: "쓰",
  recycling: "재",
  fishingLine: "줄",
  fishingGear: "구",
  ploggingCollection: "집",
  other: "수",
};

function resolveMarkerMark(location: MapLocation): string {
  if (location.partnerType === "processingShop") return "손";
  if (location.wastePointType) {
    return WASTE_MARK[location.wastePointType] ?? CATEGORY_MARK.trash;
  }
  return CATEGORY_MARK[location.category];
}

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
      return "#64748b";
    }
    return WASTE_MARKER_COLORS[location.wastePointType];
  }
  return CATEGORY_COLORS[location.category];
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
    transform: translateY(-6px);
    cursor: pointer;
    opacity: ${unavailable ? "0.55" : "1"};
    filter: drop-shadow(0 10px 16px rgba(8, 28, 58, 0.28));
  `;

  if (selected) {
    const label = document.createElement("div");
    label.textContent = location.name;
    label.className = "padopado-marker__label";
    label.style.cssText = `
      max-width: 148px;
      margin-bottom: 8px;
      padding: 5px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(255,255,255,0.55);
      background: rgba(11, 36, 71, 0.88);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.25;
      backdrop-filter: blur(10px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 10px 24px rgba(8, 28, 58, 0.35);
    `;
    wrapper.appendChild(label);
  }

  const pin = document.createElement("button");
  pin.type = "button";
  const statusHint =
    location.category === "fishing" && location.fishingAllowedStatus
      ? ` (${location.fishingAllowedStatus})`
      : location.wasteStatus
        ? ` (${location.wasteStatus})`
        : "";
  pin.setAttribute("aria-label", `${location.name}${statusHint}`);
  pin.setAttribute("aria-pressed", selected ? "true" : "false");
  const size = selected ? 38 : 30;
  pin.style.cssText = `
    position: relative;
    width: ${size}px;
    height: ${size}px;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  `;

  pin.innerHTML = `
    <span style="
      position:absolute; inset:0; border-radius:9999px;
      background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), transparent 42%),
        linear-gradient(160deg, ${color} 0%, ${color}dd 70%, #0b2447 140%);
      border: 2px solid rgba(255,255,255,0.92);
      box-shadow: ${
        selected
          ? `0 0 0 4px ${color}55, 0 0 22px ${color}88`
          : `0 0 0 1px ${color}33`
      };
    "></span>
    <span style="
      position:relative; z-index:1; display:grid; place-items:center;
      width:100%; height:100%; color:#fff; font-size:${selected ? "12px" : "11px"};
      font-weight:800; letter-spacing:-0.04em;
    ">${resolveMarkerMark(location)}</span>
  `;

  pin.addEventListener("mouseenter", () => {
    wrapper.style.transform = "translateY(-8px) scale(1.06)";
  });
  pin.addEventListener("mouseleave", () => {
    wrapper.style.transform = "translateY(-6px) scale(1)";
  });
  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect(location.id);
  });
  pin.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onSelect(location.id);
    }
  });

  wrapper.appendChild(pin);

  // Soft pin tip
  const tip = document.createElement("span");
  tip.setAttribute("aria-hidden", "true");
  tip.style.cssText = `
    width: 0; height: 0; margin-top: -2px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${color};
    filter: drop-shadow(0 2px 2px rgba(8,28,58,0.25));
  `;
  wrapper.appendChild(tip);

  if (location.category === "fishing" && location.fishingAllowedStatus === "prohibited") {
    wrapper.appendChild(statusChip("금지", "#fee2e2", "#b91c1c"));
  } else if (
    location.category === "fishing" &&
    location.fishingAllowedStatus === "restricted"
  ) {
    wrapper.appendChild(statusChip("제한", "#ffedd5", "#c2410c"));
  } else if (location.wasteStatus === "removed") {
    wrapper.appendChild(statusChip("철거", "#e2e8f0", "#475569"));
  } else if (location.wasteStatus === "temporarilyUnavailable") {
    wrapper.appendChild(statusChip("불가", "#ffedd5", "#c2410c"));
  }

  return wrapper;
}

function statusChip(text: string, bg: string, fg: string): HTMLElement {
  const badge = document.createElement("span");
  badge.textContent = text;
  badge.style.cssText = `
    margin-top: 3px;
    padding: 1px 6px;
    border-radius: 9999px;
    background: ${bg};
    color: ${fg};
    font-size: 9px;
    font-weight: 700;
    border: 1px solid rgba(255,255,255,0.65);
  `;
  return badge;
}

export function createUserLocationContent(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "map-user-location";
  wrapper.setAttribute("aria-label", "현재 위치");
  wrapper.innerHTML = `
    <span class="map-user-location__pulse" aria-hidden="true"></span>
    <span class="map-user-location__ring" aria-hidden="true"></span>
    <span class="map-user-location__dot" aria-hidden="true"></span>
  `;
  return wrapper;
}

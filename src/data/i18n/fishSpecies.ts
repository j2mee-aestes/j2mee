import type { FishSpecies } from "@/i18n/types";

/** Common coastal species names. Missing locales fall back to Korean. */
export const FISH_SPECIES: FishSpecies[] = [
  {
    id: "rockfish",
    names: { ko: "볼락", en: "Darkbanded rockfish", ja: "メバル", "zh-CN": "石斑鱼(볼락)" },
  },
  {
    id: "halfbeak",
    names: { ko: "학꽁치", en: "Japanese halfbeak", ja: "サヨリ", "zh-CN": "针鱼" },
  },
  {
    id: "black-porgy",
    names: { ko: "감성돔", en: "Blackhead seabream", ja: "クロダイ", "zh-CN": "黑鲷" },
  },
  {
    id: "girella",
    names: { ko: "벵에돔", ja: "メジナ" },
  },
  {
    id: "mackerel",
    names: { ko: "고등어", en: "Chub mackerel", ja: "サバ", "zh-CN": "青花鱼" },
  },
  {
    id: "sea-bass",
    names: { ko: "농어", en: "Japanese sea bass", ja: "スズキ", "zh-CN": "鲈鱼" },
  },
  {
    id: "greenling",
    names: { ko: "우럭", ja: "ウミタナゴ" },
  },
  {
    id: "gizzard-shad",
    names: { ko: "전어", ja: "コノシロ" },
  },
];

export function findFishSpeciesByKoreanName(name: string): FishSpecies | null {
  return (
    FISH_SPECIES.find((species) => species.names.ko === name.trim()) ?? null
  );
}

import type { SupportedLocale } from "@/i18n/config";

/** Common Busan-coast toponyms for UI location strings. */
const PLACE_TERMS: Array<{
  ko: string;
  en: string;
  ja: string;
  "zh-CN": string;
  vi: string;
  es: string;
  de: string;
  fr: string;
}> = [
  {
    ko: "부산광역시",
    en: "Busan",
    ja: "釜山広域市",
    "zh-CN": "釜山广域市",
    vi: "Busan",
    es: "Busán",
    de: "Busan",
    fr: "Busan",
  },
  {
    ko: "기장군",
    en: "Gijang-gun",
    ja: "機張郡",
    "zh-CN": "机张郡",
    vi: "Gijang",
    es: "Gijang",
    de: "Gijang",
    fr: "Gijang",
  },
  {
    ko: "기장읍",
    en: "Gijang-eup",
    ja: "機張邑",
    "zh-CN": "机张邑",
    vi: "Gijang-eup",
    es: "Gijang-eup",
    de: "Gijang-eup",
    fr: "Gijang-eup",
  },
  {
    ko: "기장",
    en: "Gijang",
    ja: "機張",
    "zh-CN": "机张",
    vi: "Gijang",
    es: "Gijang",
    de: "Gijang",
    fr: "Gijang",
  },
  {
    ko: "일광읍",
    en: "Ilgwang-eup",
    ja: "日光邑",
    "zh-CN": "日光邑",
    vi: "Ilgwang",
    es: "Ilgwang",
    de: "Ilgwang",
    fr: "Ilgwang",
  },
  {
    ko: "일광",
    en: "Ilgwang",
    ja: "日光",
    "zh-CN": "日光",
    vi: "Ilgwang",
    es: "Ilgwang",
    de: "Ilgwang",
    fr: "Ilgwang",
  },
  {
    ko: "장안읍",
    en: "Jangan-eup",
    ja: "長安邑",
    "zh-CN": "长安邑",
    vi: "Jangan",
    es: "Jangan",
    de: "Jangan",
    fr: "Jangan",
  },
  {
    ko: "임랑",
    en: "Imrang",
    ja: "任浪",
    "zh-CN": "任浪",
    vi: "Imrang",
    es: "Imrang",
    de: "Imrang",
    fr: "Imrang",
  },
  {
    ko: "대변",
    en: "Daebyeon",
    ja: "大辺",
    "zh-CN": "大边",
    vi: "Daebyeon",
    es: "Daebyeon",
    de: "Daebyeon",
    fr: "Daebyeon",
  },
  {
    ko: "학리",
    en: "Hak-ri",
    ja: "鶴里",
    "zh-CN": "鹤里",
    vi: "Hak-ri",
    es: "Hak-ri",
    de: "Hak-ri",
    fr: "Hak-ri",
  },
  {
    ko: "청사포",
    en: "Cheongsapo",
    ja: "青沙浦",
    "zh-CN": "青沙浦",
    vi: "Cheongsapo",
    es: "Cheongsapo",
    de: "Cheongsapo",
    fr: "Cheongsapo",
  },
  {
    ko: "해동용궁사",
    en: "Haedong Yonggungsa",
    ja: "海東龍宮寺",
    "zh-CN": "海东龙宫寺",
    vi: "Haedong Yonggungsa",
    es: "Haedong Yonggungsa",
    de: "Haedong Yonggungsa",
    fr: "Haedong Yonggungsa",
  },
  {
    ko: "방파제",
    en: "breakwater",
    ja: "防波堤",
    "zh-CN": "防波堤",
    vi: "đê chắn sóng",
    es: "rompeolas",
    de: "Wellenbrecher",
    fr: "digue",
  },
  {
    ko: "해수욕장",
    en: "beach",
    ja: "海水浴場",
    "zh-CN": "海水浴场",
    vi: "bãi biển",
    es: "playa",
    de: "Strand",
    fr: "plage",
  },
  {
    ko: "연안",
    en: "coast",
    ja: "沿岸",
    "zh-CN": "沿岸",
    vi: "ven biển",
    es: "costa",
    de: "Küste",
    fr: "côte",
  },
  {
    ko: "해안로",
    en: "coastal road",
    ja: "海岸路",
    "zh-CN": "海岸路",
    vi: "đường ven biển",
    es: "vía costera",
    de: "Küstenstraße",
    fr: "route côtière",
  },
  {
    ko: "해안",
    en: "coast",
    ja: "海岸",
    "zh-CN": "海岸",
    vi: "bờ biển",
    es: "costa",
    de: "Küste",
    fr: "côte",
  },
  {
    ko: "시장",
    en: "market",
    ja: "市場",
    "zh-CN": "市场",
    vi: "chợ",
    es: "mercado",
    de: "Markt",
    fr: "marché",
  },
  {
    ko: "항구",
    en: "port",
    ja: "港",
    "zh-CN": "港口",
    vi: "cảng",
    es: "puerto",
    de: "Hafen",
    fr: "port",
  },
  {
    ko: "인근",
    en: "nearby",
    ja: "付近",
    "zh-CN": "附近",
    vi: "gần",
    es: "cerca",
    de: "in der Nähe",
    fr: "à proximité",
  },
];

export function localizePlaceText(
  text: string | null | undefined,
  locale: SupportedLocale,
): string {
  if (!text) return "";
  if (locale === "ko") return text;
  let result = text;
  for (const term of PLACE_TERMS) {
    if (!result.includes(term.ko)) continue;
    const replacement = term[locale] ?? term.en;
    result = result.split(term.ko).join(replacement);
  }
  return result;
}

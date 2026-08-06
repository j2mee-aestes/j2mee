import type { LanguageCode } from "./languages";

export type UiTextKey =
  | "serviceName"
  | "searchPlaceholder"
  | "weather"
  | "tide"
  | "favorites"
  | "login"
  | "language"
  | "categoryAll"
  | "categoryFishing"
  | "categoryTide"
  | "categoryMarket"
  | "categoryUglySeafood"
  | "categoryTrash"
  | "categoryPlogging"
  | "mapComingSoon"
  | "selectedSpot"
  | "location"
  | "beginnerFriendly"
  | "parkingAvailable"
  | "toiletAvailable"
  | "targetFish"
  | "nearbyMarket"
  | "todayTide"
  | "highTide"
  | "lowTide"
  | "openMenu"
  | "closeMenu"
  | "tempFishingMarker"
  | "tempMarketMarker"
  | "tempTrashMarker"
  | "tempPloggingPath"
  | "noSpotSelected";

type UiDictionary = Record<UiTextKey, string>;

const dictionaries: Record<LanguageCode, UiDictionary> = {
  KR: {
    serviceName: "바다한끼 MAP",
    searchPlaceholder: "장소 검색",
    weather: "날씨",
    tide: "물때",
    favorites: "즐겨찾기",
    login: "로그인",
    language: "언어",
    categoryAll: "전체",
    categoryFishing: "낚시 장소",
    categoryTide: "물때",
    categoryMarket: "수산시장",
    categoryUglySeafood: "못난이 수산물",
    categoryTrash: "쓰레기통",
    categoryPlogging: "플로깅 코스",
    mapComingSoon: "지도 API 연결 예정",
    selectedSpot: "선택한 낚시 장소",
    location: "위치",
    beginnerFriendly: "초보자 추천",
    parkingAvailable: "주차 가능",
    toiletAvailable: "화장실 있음",
    targetFish: "주요 어종",
    nearbyMarket: "주변 수산시장",
    todayTide: "오늘의 만조·간조",
    highTide: "만조",
    lowTide: "간조",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    tempFishingMarker: "임시 낚시 장소",
    tempMarketMarker: "임시 수산시장",
    tempTrashMarker: "임시 쓰레기통",
    tempPloggingPath: "임시 플로깅 경로",
    noSpotSelected: "낚시 장소를 선택해 주세요",
  },
  EN: {
    serviceName: "Bada Hankki MAP",
    searchPlaceholder: "Search places",
    weather: "Weather",
    tide: "Tide",
    favorites: "Favorites",
    login: "Log in",
    language: "Language",
    categoryAll: "All",
    categoryFishing: "Fishing spots",
    categoryTide: "Tide",
    categoryMarket: "Fish market",
    categoryUglySeafood: "Ugly seafood",
    categoryTrash: "Trash bins",
    categoryPlogging: "Plogging course",
    mapComingSoon: "Map API coming soon",
    selectedSpot: "Selected fishing spot",
    location: "Location",
    beginnerFriendly: "Beginner friendly",
    parkingAvailable: "Parking available",
    toiletAvailable: "Restroom available",
    targetFish: "Target fish",
    nearbyMarket: "Nearby market",
    todayTide: "Today's high & low tide",
    highTide: "High",
    lowTide: "Low",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    tempFishingMarker: "Temp fishing spot",
    tempMarketMarker: "Temp fish market",
    tempTrashMarker: "Temp trash bin",
    tempPloggingPath: "Temp plogging path",
    noSpotSelected: "Select a fishing spot",
  },
  JP: {
    serviceName: "バダハンキ MAP",
    searchPlaceholder: "場所を検索",
    weather: "天気",
    tide: "潮汐",
    favorites: "お気に入り",
    login: "ログイン",
    language: "言語",
    categoryAll: "すべて",
    categoryFishing: "釣り場",
    categoryTide: "潮汐",
    categoryMarket: "魚市場",
    categoryUglySeafood: "規格外水産物",
    categoryTrash: "ゴミ箱",
    categoryPlogging: "プロギングコース",
    mapComingSoon: "地図API接続予定",
    selectedSpot: "選択した釣り場",
    location: "位置",
    beginnerFriendly: "初心者向け",
    parkingAvailable: "駐車可",
    toiletAvailable: "トイレあり",
    targetFish: "主な魚種",
    nearbyMarket: "周辺の魚市場",
    todayTide: "本日の満潮・干潮",
    highTide: "満潮",
    lowTide: "干潮",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    tempFishingMarker: "仮釣り場マーカー",
    tempMarketMarker: "仮魚市場マーカー",
    tempTrashMarker: "仮ゴミ箱マーカー",
    tempPloggingPath: "仮プロギング経路",
    noSpotSelected: "釣り場を選択してください",
  },
  CN: {
    serviceName: "바다한끼 MAP",
    searchPlaceholder: "搜索地点",
    weather: "天气",
    tide: "潮汐",
    favorites: "收藏",
    login: "登录",
    language: "语言",
    categoryAll: "全部",
    categoryFishing: "钓鱼地点",
    categoryTide: "潮汐",
    categoryMarket: "水产市场",
    categoryUglySeafood: "瑕疵水产",
    categoryTrash: "垃圾桶",
    categoryPlogging: "净滩路线",
    mapComingSoon: "地图 API 即将接入",
    selectedSpot: "已选钓鱼地点",
    location: "位置",
    beginnerFriendly: "适合初学者",
    parkingAvailable: "可停车",
    toiletAvailable: "有卫生间",
    targetFish: "主要鱼种",
    nearbyMarket: "附近水产市场",
    todayTide: "今日涨潮·落潮",
    highTide: "涨潮",
    lowTide: "落潮",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    tempFishingMarker: "临时钓鱼点",
    tempMarketMarker: "临时水产市场",
    tempTrashMarker: "临时垃圾桶",
    tempPloggingPath: "临时净滩路线",
    noSpotSelected: "请选择钓鱼地点",
  },
};

export function getUiText(language: LanguageCode): UiDictionary {
  return dictionaries[language];
}

export function t(language: LanguageCode, key: UiTextKey): string {
  return dictionaries[language][key];
}

import type { LeisurePlace } from "@/types/leisure";

export const mockLeisurePlaces: LeisurePlace[] = [
  {
    id: "leisure-songjeong-surfing",
    name: "송정 서핑 포인트",
    address: "부산광역시 해운대구 송정동 송정해수욕장",
    coordinates: { latitude: 35.1788, longitude: 129.1996 },
    description:
      "부산 대표 서핑 해변으로, 초보·중급 서퍼가 함께 이용합니다. 장비 대여·강습은 인근 숍에서 안내합니다.",
    activityType: "surfing",
    imageUrls: [
      "https://images.unsplash.com/photo-1502680390469-be75c6c576a2?w=800&q=80",
      "https://placehold.co/800x500/0f766e/ffffff?text=Songjeong+Surf",
    ],
    seasonNote: "봄~가을이 성수기이며, 겨울에도 슈트로 입수하는 서퍼가 있습니다.",
    verificationStatus: "partner",
    lastVerifiedAt: "2026-08-05",
    sourceName: "공개 해안 레저 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EC%86%A1%EC%A0%95%ED%95%B4%EC%88%98%EC%9A%95%EC%9E%A5",
  },
  {
    id: "leisure-haeundae-yacht",
    name: "해운대 요트 체험",
    address: "부산광역시 해운대구 해운대해변로 일대",
    coordinates: { latitude: 35.1588, longitude: 129.1606 },
    description:
      "해운대 해안에서 운항하는 요트·마린 투어 출발 구역입니다. 예약·운항 여부는 업체에 확인해 주세요.",
    activityType: "yacht",
    imageUrls: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80",
      "https://placehold.co/800x500/134e4a/ffffff?text=Haeundae+Yacht",
    ],
    seasonNote: "기상·해상 조건에 따라 운항이 취소될 수 있습니다.",
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-04",
    sourceName: "공개 해안 레저 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%ED%95%B4%EC%9A%B4%EB%8C%80%EC%9A%94%ED%8A%B8",
  },
  {
    id: "leisure-igidae-kayak",
    name: "이기대 해안 카약",
    address: "부산광역시 남구 용호동 이기대 해안",
    coordinates: { latitude: 35.1254, longitude: 129.1182 },
    description:
      "이기대 인근 해안에서 즐기는 카약·수상 체험 포인트입니다. 파고·조류를 확인하고 안전장비를 착용하세요.",
    activityType: "kayak",
    imageUrls: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      "https://placehold.co/800x500/115e59/ffffff?text=Igidae+Kayak",
    ],
    seasonNote: "여름~초가을이 이용에 유리하며, 강풍·높은 파고 시 중단됩니다.",
    verificationStatus: "unverified",
    lastVerifiedAt: "2026-07-20",
    sourceName: "공개 해안 레저 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EC%9D%B4%EA%B8%B0%EB%8C%80",
  },
  {
    id: "leisure-gijang-coastal-bike",
    name: "기장 해안 자전거 코스",
    address: "부산광역시 기장군 기장해안로 일대",
    coordinates: { latitude: 35.2405, longitude: 129.2188 },
    description:
      "기장 해안도로를 따라 달리는 자전거 코스입니다. 차량 통행이 있으니 안전에 유의하세요.",
    activityType: "bike",
    imageUrls: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
      "https://placehold.co/800x500/0d9488/ffffff?text=Gijang+Bike",
    ],
    seasonNote: "사계절 이용 가능. 여름 한낮·태풍 경보 시에는 피하세요.",
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-05",
    sourceName: "공개 해안 레저 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EA%B8%B0%EC%9E%A5%ED%95%B4%EC%95%88%EB%A1%9C",
  },
];

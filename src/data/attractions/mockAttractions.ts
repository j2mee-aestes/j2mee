import type { AttractionPlace } from "@/types/attraction";

export const mockAttractions: AttractionPlace[] = [
  {
    id: "attraction-haedong-yonggungsa",
    name: "해동용궁사",
    address: "부산광역시 기장군 기장읍 용궁길 86",
    coordinates: { latitude: 35.1882, longitude: 129.2233 },
    description:
      "기장 해안 절벽에 자리한 사찰로, 바다를 내려다보는 전망과 해안 산책로로 유명합니다.",
    imageUrls: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
      "https://placehold.co/800x500/0c4a6e/ffffff?text=Haedong+Yonggungsa",
    ],
    highlights: ["해안 절벽 전망", "일출 명소", "기장 해안 산책"],
    model3dUrl: "/models/attraction-placeholder.glb",
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-05",
    sourceName: "공개 관광·지도 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%ED%95%B4%EB%8F%99%EC%9A%A9%EA%B6%81%EC%82%AC",
    voteCount: 128,
  },
  {
    id: "attraction-oryukdo",
    name: "오륙도",
    address: "부산광역시 남구 오륙도해안산책로",
    coordinates: { latitude: 35.1017, longitude: 129.1253 },
    description:
      "부산 남구 해안의 섬 무리와 스카이워크로 알려진 명소입니다. 해안 산책과 전망을 함께 즐길 수 있습니다.",
    imageUrls: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://placehold.co/800x500/0369a1/ffffff?text=Oryukdo",
    ],
    highlights: ["오륙도 스카이워크", "해안 산책로", "일몰 포인트"],
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-04",
    sourceName: "공개 관광·지도 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EC%98%A4%EB%A5%99%EB%8F%84",
    voteCount: 96,
  },
  {
    id: "attraction-dadaepo",
    name: "다대포 해수욕장",
    address: "부산광역시 사하구 다대동 다대포해수욕장",
    coordinates: { latitude: 35.0478, longitude: 128.9667 },
    description:
      "낙동강 하구와 맞닿은 넓은 해변으로, 일몰과 해안 산책으로 잘 알려져 있습니다.",
    imageUrls: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80",
      "https://placehold.co/800x500/0e7490/ffffff?text=Dadaepo",
    ],
    highlights: ["일몰", "넓은 백사장", "해안 공원"],
    verificationStatus: "partner",
    lastVerifiedAt: "2026-08-03",
    sourceName: "공개 관광·지도 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EB%8B%A4%EB%8C%80%ED%8F%AC%ED%95%B4%EC%88%98%EC%9A%95%EC%9E%A5",
    voteCount: 84,
  },
  {
    id: "attraction-igidae",
    name: "이기대 해안산책로",
    address: "부산광역시 남구 용호동 이기대해안산책로",
    coordinates: { latitude: 35.1267, longitude: 129.1194 },
    description:
      "남구 해안을 따라 이어지는 산책로로, 기암과 바다 전망이 이어집니다. 일부 구간은 경사가 있습니다.",
    imageUrls: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      "https://placehold.co/800x500/155e75/ffffff?text=Igidae",
    ],
    highlights: ["기암 절경", "해안 트레일", "부산항 전망"],
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-05",
    sourceName: "공개 관광·지도 안내 참고",
    sourceUrl: "https://map.kakao.com/?q=%EC%9D%B4%EA%B8%B0%EB%8C%80%ED%95%B4%EC%95%88%EC%82%B0%EC%B1%85%EB%A1%9C",
    voteCount: 72,
  },
];

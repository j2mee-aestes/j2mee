import assert from "node:assert/strict";
import test from "node:test";

function getKakaoSdkUrl(appKey) {
  return `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
}

test("Kakao SDK URL uses autoload=false and encodes key", () => {
  const url = getKakaoSdkUrl("abc/def");
  assert.equal(
    url,
    "https://dapi.kakao.com/v2/maps/sdk.js?appkey=abc%2Fdef&autoload=false",
  );
});

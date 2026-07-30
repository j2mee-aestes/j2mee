#!/usr/bin/env bash
# 명조:워더링 웨이브 태블릿 심화 부스트 (ADB)
# USB 디버깅 또는 무선 디버깅 연결 후 실행하세요.
set -euo pipefail

PKG="${MINGCHO_PKG:-com.kurogame.wutheringwaves.global}"
CANDIDATES=(
  "com.kurogame.wutheringwaves.global"
  "com.kurogame.wutheringwaves.vn"
  "com.kurogame.mingchao"
  "com.kurogame.wutheringwaves"
)

if ! command -v adb >/dev/null 2>&1; then
  echo "adb 가 필요합니다. Android platform-tools 를 설치하세요."
  exit 1
fi

adb start-server >/dev/null
DEVICES="$(adb devices | awk 'NR>1 && $2=="device" {print $1}')"
if [[ -z "${DEVICES}" ]]; then
  echo "연결된 태블릿이 없습니다. USB/무선 디버깅을 확인하세요."
  exit 1
fi

resolve_pkg() {
  for p in "${CANDIDATES[@]}"; do
    if adb shell pm path "$p" >/dev/null 2>&1; then
      echo "$p"
      return 0
    fi
  done
  echo "$PKG"
}

TARGET="$(resolve_pkg)"
echo "==> 타깃 패키지: ${TARGET}"

echo "==> 백그라운드 앱 정리 (명조 제외)"
# 최근 앱 목록 기반 force-stop 은 위험하므로, 캐시 trim + 우선순위만 조정
adb shell am kill-all || true
adb shell cmd package compile -m speed -f "$TARGET" || true

echo "==> Game Mode PERFORMANCE"
adb shell cmd game mode performance "$TARGET" || \
  adb shell cmd game set-game-mode "$TARGET" 2 || true

echo "==> 명조 배터리 최적화 예외"
adb shell dumpsys deviceidle whitelist +"$TARGET" || true

echo "==> 불필요 애니메이션 축소 (원하면 복구: scale 1)"
adb shell settings put global window_animation_scale 0.5 || true
adb shell settings put global transition_animation_scale 0.5 || true
adb shell settings put global animator_duration_scale 0.5 || true

echo "==> 메모리 상태"
adb shell dumpsys meminfo "$TARGET" | head -n 40 || true

echo "==> 명조 실행"
adb shell monkey -p "$TARGET" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1 || \
  adb shell am start -n "$TARGET"/.MainActivity || true

echo "완료. 태블릿에서 명조가 실행되면 성능 세션이 적용된 상태입니다."
echo "복구 예시:"
echo "  adb shell settings put global window_animation_scale 1"
echo "  adb shell cmd game mode standard ${TARGET}"

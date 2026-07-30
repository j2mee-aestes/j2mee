# 명조 부스트 (GameBoost)

안드로이드 태블릿에서 **명조:워더링 웨이브** (`com.kurogame.wutheringwaves.global`) 프레임을 안정화하기 위한 성능 세션 앱입니다.

## 기능

- 명조 패키지 자동 탐지·연결
- 원탭 부스트: 백그라운드 정리, 메모리 트림, Game Mode, Wi‑Fi/CPU 락
- 프로필: 가볍게 / 균형 / 최대 성능
- 포그라운드 감지 시 자동 부스트 (사용정보 권한)
- 배터리 최적화 예외 안내
- ADB 심화 스크립트 (`scripts/adb_boost_mingcho.sh`)

## 빌드

Android Studio Ladybug+ 또는 JDK 17 환경:

```bash
cd game-boost
./gradlew :app:assembleDebug
```

APK: `app/build/outputs/apk/debug/app-debug.apk`

## 사용

1. 태블릿에 APK 설치
2. 배터리 최적화 예외 · 사용정보 접근 허용
3. **지금 부스트** 또는 **부스트 후 명조 실행**
4. (선택) PC에서 `scripts/adb_boost_mingcho.sh` 실행 — Game Mode / 컴파일 최적화

## 한계

루트 없이 CPU governor·강제 클럭 변경은 불가합니다. OEM 고성능 모드·쿨러와 함께 쓰는 것을 권장합니다.

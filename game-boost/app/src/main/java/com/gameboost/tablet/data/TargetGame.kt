package com.gameboost.tablet.data

/**
 * 명조:워더링 웨이브(Wuthering Waves) 타깃 프리셋.
 * Play Store 글로벌 패키지: com.kurogame.wutheringwaves.global
 */
object TargetGame {
    const val DISPLAY_NAME = "명조:워더링 웨이브"
    const val SHORT_NAME = "명조"
    const val PRIMARY_PACKAGE = "com.kurogame.wutheringwaves.global"

    /** 설치본/지역에 따라 달라질 수 있는 후보 패키지 */
    val PACKAGE_CANDIDATES = listOf(
        "com.kurogame.wutheringwaves.global",
        "com.kurogame.wutheringwaves.vn",
        "com.kurogame.mingchao",
        "com.kurogame.wutheringwaves"
    )

    const val NOTES = "오픈월드·고해상도 전투 부하가 큰 Unreal Engine 타이틀. " +
        "백그라운드 정리, Game Mode PERFORMANCE, 배터리 최적화 예외, " +
        "안정적 Wi‑Fi가 프레임 유지에 가장 효과적입니다."

    fun resolveInstalledPackage(isInstalled: (String) -> Boolean): String? =
        PACKAGE_CANDIDATES.firstOrNull(isInstalled) ?: PRIMARY_PACKAGE
}

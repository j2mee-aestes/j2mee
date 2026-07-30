package com.gameboost.tablet.data

enum class BoostProfile(
    val label: String,
    val description: String,
    val clearBackground: Boolean,
    val requestGameMode: Boolean,
    val wifiLock: Boolean,
    val wakeLock: Boolean,
    val trimMemory: Boolean
) {
    BALANCED(
        label = "균형",
        description = "발열과 성능의 균형. 일상 플레이용.",
        clearBackground = true,
        requestGameMode = true,
        wifiLock = false,
        wakeLock = false,
        trimMemory = true
    ),
    MAX(
        label = "최대 성능",
        description = "백그라운드 정리 + Game Mode + Wi‑Fi/CPU 유지.",
        clearBackground = true,
        requestGameMode = true,
        wifiLock = true,
        wakeLock = true,
        trimMemory = true
    ),
    LIGHT(
        label = "가볍게",
        description = "최소 개입. Game Mode만 적용.",
        clearBackground = false,
        requestGameMode = true,
        wifiLock = false,
        wakeLock = false,
        trimMemory = false
    )
}

package com.gameboost.tablet.boost

import android.app.ActivityManager
import android.app.GameManager
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.PowerManager
import android.os.Process
import android.provider.Settings
import androidx.core.net.toUri
import com.gameboost.tablet.data.BoostPreferences
import com.gameboost.tablet.data.BoostProfile
import com.gameboost.tablet.data.TargetGame

data class BoostResult(
    val profile: BoostProfile,
    val targetPackage: String?,
    val clearedProcesses: Int,
    val gameModeApplied: Boolean,
    val batteryUnrestricted: Boolean,
    val notes: List<String>
)

class PerformanceBooster(private val context: Context) {

    private val prefs = BoostPreferences(context)
    private val activityManager =
        context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    private val powerManager =
        context.getSystemService(Context.POWER_SERVICE) as PowerManager

    private var wifiLock: WifiManager.WifiLock? = null
    private var wakeLock: PowerManager.WakeLock? = null

    fun boostNow(profile: BoostProfile = prefs.profile()): BoostResult {
        val notes = mutableListOf<String>()
        var cleared = 0
        var gameModeApplied = false

        if (profile.clearBackground) {
            cleared = clearBackgroundApps()
            notes += "백그라운드 프로세스 정리 요청: ${cleared}개"
        }

        if (profile.trimMemory) {
            trimOwnMemory()
            notes += "메모리 트림 완료"
        }

        if (profile.requestGameMode) {
            gameModeApplied = applyGameMode(prefs.targetPackage)
            notes += if (gameModeApplied) {
                "Game Mode = PERFORMANCE"
            } else {
                "Game Mode API 미지원 또는 대상 미설정"
            }
        }

        if (profile.wifiLock) {
            acquireWifiLock()
            notes += "고성능 Wi‑Fi 락 유지"
        } else {
            releaseWifiLock()
        }

        if (profile.wakeLock) {
            acquireWakeLock()
            notes += "CPU WakeLock 유지 (부스트 세션 동안)"
        } else {
            releaseWakeLock()
        }

        val batteryOk = isIgnoringBatteryOptimizations()
        if (!batteryOk) {
            notes += "배터리 최적화 예외가 필요합니다"
        }

        val target = prefs.targetPackage
        if (target != null && target in TargetGame.PACKAGE_CANDIDATES) {
            notes += "타깃: ${TargetGame.SHORT_NAME} ($target)"
            notes += TargetGame.NOTES
        }

        prefs.lastBoostAt = System.currentTimeMillis()

        return BoostResult(
            profile = profile,
            targetPackage = target,
            clearedProcesses = cleared,
            gameModeApplied = gameModeApplied,
            batteryUnrestricted = batteryOk,
            notes = notes
        )
    }

    fun releaseSessionLocks() {
        releaseWifiLock()
        releaseWakeLock()
    }

    fun isIgnoringBatteryOptimizations(): Boolean =
        powerManager.isIgnoringBatteryOptimizations(context.packageName)

    fun batteryOptimizationIntent(): Intent {
        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = "package:${context.packageName}".toUri()
        }
        return intent
    }

    fun usageAccessSettingsIntent(): Intent =
        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)

    fun notificationPolicyIntent(): Intent =
        Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS)

    private fun clearBackgroundApps(): Int {
        val keep = buildSet {
            add(context.packageName)
            prefs.targetPackage?.let { add(it) }
            addAll(TargetGame.PACKAGE_CANDIDATES)
        }

        val running = activityManager.runningAppProcesses ?: return 0
        var count = 0
        for (process in running) {
            val pkg = process.processName.substringBefore(":")
            if (pkg in keep) continue
            if (process.importance <= ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                continue
            }
            if (process.uid == Process.SYSTEM_UID) continue
            runCatching {
                activityManager.killBackgroundProcesses(pkg)
                count++
            }
        }
        // Extra nudge for the system to reclaim memory
        activityManager.killBackgroundProcesses(context.packageName)
        return count
    }

    private fun trimOwnMemory() {
        System.gc()
        Runtime.getRuntime().gc()
    }

    @Suppress("UNUSED_PARAMETER")
    private fun applyGameMode(targetPackage: String?): Boolean {
        // In-app GameManager.setGameMode is API 33+ and applies to this process.
        // For 명조 패키지 자체에는 ADB 스크립트(cmd game mode)가 더 확실합니다.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return false
        val gameManager = context.getSystemService(GameManager::class.java) ?: return false
        return runCatching {
            gameManager.setGameMode(GameManager.GAME_MODE_PERFORMANCE)
            true
        }.getOrDefault(false)
    }

    @Suppress("DEPRECATION")
    private fun acquireWifiLock() {
        if (wifiLock?.isHeld == true) return
        val wifiManager =
            context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        wifiLock = wifiManager.createWifiLock(
            WifiManager.WIFI_MODE_FULL_HIGH_PERF,
            "GameBoost:WifiLock"
        ).apply {
            setReferenceCounted(false)
            acquire()
        }
    }

    private fun releaseWifiLock() {
        wifiLock?.let { lock ->
            if (lock.isHeld) lock.release()
        }
        wifiLock = null
    }

    private fun acquireWakeLock() {
        if (wakeLock?.isHeld == true) return
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "GameBoost:CpuLock"
        ).apply {
            setReferenceCounted(false)
            acquire(4 * 60 * 60 * 1000L) // max 4 hours safety
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let { lock ->
            if (lock.isHeld) lock.release()
        }
        wakeLock = null
    }
}

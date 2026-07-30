package com.gameboost.tablet.boost

import android.app.ActivityManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import android.os.Debug
import android.os.SystemClock

data class SystemSnapshot(
    val availMemMb: Long,
    val totalMemMb: Long,
    val usedPercent: Int,
    val lowMemory: Boolean,
    val nativeHeapMb: Long,
    val foregroundPackage: String?,
    val uptimeMs: Long
)

class SystemMonitor(private val context: Context) {

    private val activityManager =
        context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

    fun snapshot(): SystemSnapshot {
        val memInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memInfo)
        val total = memInfo.totalMem / (1024 * 1024)
        val avail = memInfo.availMem / (1024 * 1024)
        val usedPercent = if (total > 0) {
            (((total - avail) * 100) / total).toInt()
        } else {
            0
        }
        return SystemSnapshot(
            availMemMb = avail,
            totalMemMb = total,
            usedPercent = usedPercent,
            lowMemory = memInfo.lowMemory,
            nativeHeapMb = Debug.getNativeHeapAllocatedSize() / (1024 * 1024),
            foregroundPackage = detectForegroundPackage(),
            uptimeMs = SystemClock.elapsedRealtime()
        )
    }

    fun hasUsageAccess(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as android.app.AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                "android:get_usage_stats",
                android.os.Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                "android:get_usage_stats",
                android.os.Process.myUid(),
                context.packageName
            )
        }
        return mode == android.app.AppOpsManager.MODE_ALLOWED
    }

    private fun detectForegroundPackage(): String? {
        if (!hasUsageAccess()) return null
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val end = System.currentTimeMillis()
        val start = end - 60_000
        val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end)
            ?: return null
        return stats
            .filter { it.lastTimeUsed > 0 }
            .maxByOrNull { it.lastTimeUsed }
            ?.packageName
    }
}

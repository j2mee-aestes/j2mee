package com.gameboost.tablet.data

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable

data class InstalledApp(
    val packageName: String,
    val label: String,
    val icon: Drawable,
    val isGame: Boolean
)

object AppCatalog {

    fun loadLaunchableApps(context: Context): List<InstalledApp> {
        val pm = context.packageManager
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val resolveInfos = pm.queryIntentActivities(intent, PackageManager.MATCH_ALL)

        return resolveInfos
            .asSequence()
            .mapNotNull { info ->
                val packageName = info.activityInfo.packageName
                if (packageName == context.packageName) return@mapNotNull null
                val appInfo = runCatching {
                    pm.getApplicationInfo(packageName, 0)
                }.getOrNull() ?: return@mapNotNull null
                val label = info.loadLabel(pm)?.toString()
                    ?: appInfo.loadLabel(pm).toString()
                val isMingcho = packageName in TargetGame.PACKAGE_CANDIDATES
                InstalledApp(
                    packageName = packageName,
                    label = label,
                    icon = info.loadIcon(pm),
                    isGame = isMingcho || isLikelyGame(appInfo)
                )
            }
            .distinctBy { it.packageName }
            .sortedWith(
                compareByDescending<InstalledApp> { it.packageName in TargetGame.PACKAGE_CANDIDATES }
                    .thenByDescending { it.isGame }
                    .thenBy { it.label.lowercase() }
            )
            .toList()
    }

    fun findMingchoPackage(context: Context): String? {
        val pm = context.packageManager
        return TargetGame.resolveInstalledPackage { pkg ->
            runCatching {
                pm.getPackageInfo(pkg, 0)
                true
            }.getOrDefault(false)
        }.takeIf { pkg ->
            runCatching {
                pm.getPackageInfo(pkg, 0)
                true
            }.getOrDefault(false)
        }
    }

    private fun isLikelyGame(info: ApplicationInfo): Boolean {
        if ((info.flags and ApplicationInfo.FLAG_IS_GAME) != 0) return true
        return info.category == ApplicationInfo.CATEGORY_GAME
    }
}

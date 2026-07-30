package com.gameboost.tablet.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.gameboost.tablet.R
import com.gameboost.tablet.boost.PerformanceBooster
import com.gameboost.tablet.boost.SystemMonitor
import com.gameboost.tablet.data.BoostPreferences
import com.gameboost.tablet.receiver.BoostActionReceiver
import com.gameboost.tablet.ui.MainActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class BoostForegroundService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private var monitorJob: Job? = null

    private lateinit var prefs: BoostPreferences
    private lateinit var booster: PerformanceBooster
    private lateinit var monitor: SystemMonitor

    private var lastAutoBoostAt = 0L

    override fun onCreate() {
        super.onCreate()
        prefs = BoostPreferences(this)
        booster = PerformanceBooster(this)
        monitor = SystemMonitor(this)
        createChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                stopBoostSession()
                return START_NOT_STICKY
            }
            ACTION_BOOST_NOW -> {
                val result = booster.boostNow()
                updateNotification("부스트 완료 · ${result.profile.label}")
            }
            else -> startBoostSession()
        }
        return START_STICKY
    }

    private fun startBoostSession() {
        val notification = buildNotification("성능 모니터 실행 중")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ServiceCompat.startForeground(
                this,
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        booster.boostNow()
        monitorJob?.cancel()
        monitorJob = scope.launch {
            while (isActive) {
                val snap = monitor.snapshot()
                val target = prefs.targetPackage
                val label = prefs.targetLabel ?: target ?: "미선택"
                updateNotification(
                    "$label · RAM ${snap.usedPercent}% · 여유 ${snap.availMemMb}MB"
                )

                if (prefs.autoBoostEnabled &&
                    target != null &&
                    snap.foregroundPackage == target
                ) {
                    val now = System.currentTimeMillis()
                    if (now - lastAutoBoostAt > AUTO_BOOST_COOLDOWN_MS) {
                        booster.boostNow()
                        lastAutoBoostAt = now
                    }
                }
                delay(POLL_MS)
            }
        }
    }

    private fun stopBoostSession() {
        monitorJob?.cancel()
        booster.releaseSessionLocks()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onDestroy() {
        monitorJob?.cancel()
        booster.releaseSessionLocks()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createChannel() {
        val manager = getSystemService(NotificationManager::class.java)
        val channel = NotificationChannel(
            CHANNEL_ID,
            getString(R.string.notification_channel),
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = getString(R.string.notification_channel_desc)
        }
        manager.createNotificationChannel(channel)
    }

    private fun buildNotification(content: String): Notification {
        val open = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val boost = PendingIntent.getBroadcast(
            this,
            1,
            Intent(this, BoostActionReceiver::class.java).setAction(BoostActionReceiver.ACTION_BOOST),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val stop = PendingIntent.getService(
            this,
            2,
            Intent(this, BoostForegroundService::class.java).setAction(ACTION_STOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_boost)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText(content)
            .setContentIntent(open)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .addAction(0, getString(R.string.action_boost_now), boost)
            .addAction(0, getString(R.string.action_stop), stop)
            .build()
    }

    private fun updateNotification(content: String) {
        val manager = getSystemService(NotificationManager::class.java)
        manager.notify(NOTIFICATION_ID, buildNotification(content))
    }

    companion object {
        const val ACTION_START = "com.gameboost.tablet.action.START"
        const val ACTION_STOP = "com.gameboost.tablet.action.STOP"
        const val ACTION_BOOST_NOW = "com.gameboost.tablet.action.BOOST_NOW"
        private const val CHANNEL_ID = "game_boost_monitor"
        private const val NOTIFICATION_ID = 1001
        private const val POLL_MS = 3_000L
        private const val AUTO_BOOST_COOLDOWN_MS = 45_000L

        fun start(context: Context) {
            val intent = Intent(context, BoostForegroundService::class.java)
                .setAction(ACTION_START)
            context.startForegroundService(intent)
        }

        fun stop(context: Context) {
            val intent = Intent(context, BoostForegroundService::class.java)
                .setAction(ACTION_STOP)
            context.startService(intent)
        }

        fun boostNow(context: Context) {
            val intent = Intent(context, BoostForegroundService::class.java)
                .setAction(ACTION_BOOST_NOW)
            context.startForegroundService(intent)
        }
    }
}

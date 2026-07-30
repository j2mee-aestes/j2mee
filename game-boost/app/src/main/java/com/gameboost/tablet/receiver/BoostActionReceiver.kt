package com.gameboost.tablet.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.gameboost.tablet.service.BoostForegroundService

class BoostActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        when (intent?.action) {
            ACTION_BOOST -> BoostForegroundService.boostNow(context)
        }
    }

    companion object {
        const val ACTION_BOOST = "com.gameboost.tablet.action.NOTIFY_BOOST"
    }
}

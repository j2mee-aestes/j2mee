package com.gameboost.tablet.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.gameboost.tablet.R
import com.gameboost.tablet.boost.PerformanceBooster
import com.gameboost.tablet.boost.SystemMonitor
import com.gameboost.tablet.data.AppCatalog
import com.gameboost.tablet.data.BoostPreferences
import com.gameboost.tablet.data.BoostProfile
import com.gameboost.tablet.data.TargetGame
import com.gameboost.tablet.databinding.ActivityMainBinding
import com.gameboost.tablet.service.BoostForegroundService
import com.google.android.material.chip.Chip
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: BoostPreferences
    private lateinit var booster: PerformanceBooster
    private lateinit var monitor: SystemMonitor

    private var ticker: Job? = null
    private var sessionActive = false

    private val pickAppLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                refreshTargetUi()
            }
        }

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { /* no-op */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = BoostPreferences(this)
        booster = PerformanceBooster(this)
        monitor = SystemMonitor(this)

        setupProfileChips()
        setupClicks()
        autoBindMingchoIfNeeded()
        refreshTargetUi()
        refreshPermissionUi()
        ensureNotificationPermission()
        startTicker()
    }

    private fun autoBindMingchoIfNeeded() {
        if (!prefs.targetPackage.isNullOrBlank()) return
        val installed = AppCatalog.findMingchoPackage(this)
        if (installed != null) {
            prefs.targetPackage = installed
            prefs.targetLabel = TargetGame.DISPLAY_NAME
            Toast.makeText(this, R.string.toast_auto_bound, Toast.LENGTH_SHORT).show()
        } else {
            // 기본 타깃을 명조 글로벌 패키지로 미리 지정 (미설치여도 안내)
            prefs.targetPackage = TargetGame.PRIMARY_PACKAGE
            prefs.targetLabel = TargetGame.DISPLAY_NAME
        }
    }

    override fun onResume() {
        super.onResume()
        refreshPermissionUi()
        refreshTargetUi()
    }

    override fun onDestroy() {
        ticker?.cancel()
        super.onDestroy()
    }

    private fun setupProfileChips() {
        binding.profileChips.removeAllViews()
        BoostProfile.entries.forEach { profile ->
            val chip = Chip(this).apply {
                text = profile.label
                isCheckable = true
                isChecked = prefs.profile() == profile
                setOnClickListener {
                    prefs.profileName = profile.name
                    binding.profileDescription.text = profile.description
                    BoostProfile.entries.forEachIndexed { index, _ ->
                        (binding.profileChips.getChildAt(index) as? Chip)?.isChecked =
                            prefs.profile() == BoostProfile.entries[index]
                    }
                }
            }
            binding.profileChips.addView(chip)
        }
        binding.profileDescription.text = prefs.profile().description
        binding.autoBoostSwitch.isChecked = prefs.autoBoostEnabled
        binding.autoBoostSwitch.setOnCheckedChangeListener { _, checked ->
            prefs.autoBoostEnabled = checked
        }
    }

    private fun setupClicks() {
        binding.selectGameButton.setOnClickListener {
            pickAppLauncher.launch(Intent(this, AppPickerActivity::class.java))
        }

        binding.boostButton.setOnClickListener {
            if (prefs.targetPackage.isNullOrBlank()) {
                Toast.makeText(this, R.string.toast_select_game, Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val result = booster.boostNow()
            binding.logText.text = result.notes.joinToString("\n") { "• $it" }
            Toast.makeText(this, R.string.toast_boost_done, Toast.LENGTH_SHORT).show()
            refreshStats()
        }

        binding.sessionButton.setOnClickListener {
            if (sessionActive) {
                BoostForegroundService.stop(this)
                sessionActive = false
                binding.sessionButton.text = getString(R.string.start_session)
                Toast.makeText(this, R.string.toast_session_stopped, Toast.LENGTH_SHORT).show()
            } else {
                if (prefs.targetPackage.isNullOrBlank()) {
                    Toast.makeText(this, R.string.toast_select_game, Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                BoostForegroundService.start(this)
                sessionActive = true
                binding.sessionButton.text = getString(R.string.stop_session)
                Toast.makeText(this, R.string.toast_session_started, Toast.LENGTH_SHORT).show()
            }
        }

        binding.batteryButton.setOnClickListener {
            startActivity(booster.batteryOptimizationIntent())
        }

        binding.usageButton.setOnClickListener {
            startActivity(booster.usageAccessSettingsIntent())
        }

        binding.launchGameButton.setOnClickListener {
            val pkg = prefs.targetPackage
            if (pkg.isNullOrBlank()) {
                Toast.makeText(this, R.string.toast_select_game, Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            booster.boostNow()
            val launch = packageManager.getLaunchIntentForPackage(pkg)
            if (launch == null) {
                Toast.makeText(this, R.string.toast_cannot_launch, Toast.LENGTH_SHORT).show()
            } else {
                startActivity(launch)
            }
        }
    }

    private fun refreshTargetUi() {
        val label = prefs.targetLabel
        val pkg = prefs.targetPackage
        if (pkg.isNullOrBlank()) {
            binding.targetName.text = getString(R.string.no_game_selected)
            binding.targetPackage.text = getString(R.string.pick_game_hint)
        } else {
            binding.targetName.text = label ?: pkg
            binding.targetPackage.text = pkg
        }
        val last = prefs.lastBoostAt
        binding.lastBoostText.text = if (last == 0L) {
            getString(R.string.never_boosted)
        } else {
            getString(
                R.string.last_boost_at,
                SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date(last))
            )
        }
    }

    private fun refreshPermissionUi() {
        val batteryOk = booster.isIgnoringBatteryOptimizations()
        val usageOk = monitor.hasUsageAccess()
        binding.batteryStatus.text = if (batteryOk) {
            getString(R.string.status_ok)
        } else {
            getString(R.string.status_need_battery)
        }
        binding.usageStatus.text = if (usageOk) {
            getString(R.string.status_ok)
        } else {
            getString(R.string.status_need_usage)
        }
        binding.batteryButton.isEnabled = !batteryOk
        binding.usageButton.isEnabled = !usageOk
    }

    private fun refreshStats() {
        val snap = monitor.snapshot()
        binding.ramText.text = getString(
            R.string.ram_stats,
            snap.usedPercent,
            snap.availMemMb,
            snap.totalMemMb
        )
        binding.foregroundText.text = snap.foregroundPackage
            ?: getString(R.string.foreground_unknown)
        binding.lowMemBadge.alpha = if (snap.lowMemory) 1f else 0.25f
    }

    private fun startTicker() {
        ticker?.cancel()
        ticker = lifecycleScope.launch {
            while (isActive) {
                refreshStats()
                delay(2_000)
            }
        }
    }

    private fun ensureNotificationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val granted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) {
            permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }
}

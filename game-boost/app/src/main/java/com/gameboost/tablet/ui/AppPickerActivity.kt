package com.gameboost.tablet.ui

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.gameboost.tablet.R
import com.gameboost.tablet.data.AppCatalog
import com.gameboost.tablet.data.BoostPreferences
import com.gameboost.tablet.data.InstalledApp
import com.gameboost.tablet.data.TargetGame
import com.gameboost.tablet.databinding.ActivityAppPickerBinding
import com.gameboost.tablet.databinding.ItemAppBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AppPickerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAppPickerBinding
    private lateinit var prefs: BoostPreferences
    private val adapter = AppAdapter { app ->
        prefs.targetPackage = app.packageName
        prefs.targetLabel = app.label
        setResult(RESULT_OK, Intent())
        finish()
    }
    private var allApps: List<InstalledApp> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAppPickerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        prefs = BoostPreferences(this)

        binding.toolbar.setNavigationOnClickListener { finish() }
        binding.appList.layoutManager = LinearLayoutManager(this)
        binding.appList.adapter = adapter

        binding.searchInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) = Unit
            override fun afterTextChanged(s: Editable?) {
                filter(s?.toString().orEmpty())
            }
        })

        binding.gamesOnlySwitch.setOnCheckedChangeListener { _, _ ->
            filter(binding.searchInput.text?.toString().orEmpty())
        }

        lifecycleScope.launch {
            allApps = withContext(Dispatchers.Default) {
                AppCatalog.loadLaunchableApps(this@AppPickerActivity)
            }
            filter("")
        }
    }

    private fun filter(query: String) {
        val q = query.trim().lowercase()
        val gamesOnly = binding.gamesOnlySwitch.isChecked
        adapter.submit(
            allApps.filter { app ->
                (!gamesOnly || app.isGame) &&
                    (q.isEmpty() ||
                        app.label.lowercase().contains(q) ||
                        app.packageName.lowercase().contains(q))
            }
        )
    }

    private class AppAdapter(
        private val onClick: (InstalledApp) -> Unit
    ) : RecyclerView.Adapter<AppAdapter.Holder>() {

        private val items = mutableListOf<InstalledApp>()

        fun submit(list: List<InstalledApp>) {
            items.clear()
            items.addAll(list)
            notifyDataSetChanged()
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
            val binding = ItemAppBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
            return Holder(binding)
        }

        override fun onBindViewHolder(holder: Holder, position: Int) {
            holder.bind(items[position], onClick)
        }

        override fun getItemCount(): Int = items.size

        class Holder(private val binding: ItemAppBinding) : RecyclerView.ViewHolder(binding.root) {
            fun bind(app: InstalledApp, onClick: (InstalledApp) -> Unit) {
                binding.appIcon.setImageDrawable(app.icon)
                binding.appLabel.text = app.label
                binding.appPackage.text = app.packageName
                val isMingcho = app.packageName in TargetGame.PACKAGE_CANDIDATES
                if (isMingcho || app.isGame) {
                    binding.gameBadge.visibility = android.view.View.VISIBLE
                    binding.gameBadge.text = if (isMingcho) {
                        binding.root.context.getString(R.string.badge_mingcho)
                    } else {
                        binding.root.context.getString(R.string.badge_game)
                    }
                } else {
                    binding.gameBadge.visibility = android.view.View.GONE
                }
                binding.root.setOnClickListener { onClick(app) }
            }
        }
    }
}

package com.gameboost.tablet.data

import android.content.Context
import android.content.SharedPreferences

class BoostPreferences(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    var targetPackage: String?
        get() = prefs.getString(KEY_TARGET_PACKAGE, null)
        set(value) = prefs.edit().putString(KEY_TARGET_PACKAGE, value).apply()

    var targetLabel: String?
        get() = prefs.getString(KEY_TARGET_LABEL, null)
        set(value) = prefs.edit().putString(KEY_TARGET_LABEL, value).apply()

    var profileName: String
        get() = prefs.getString(KEY_PROFILE, BoostProfile.MAX.name) ?: BoostProfile.MAX.name
        set(value) = prefs.edit().putString(KEY_PROFILE, value).apply()

    var autoBoostEnabled: Boolean
        get() = prefs.getBoolean(KEY_AUTO_BOOST, true)
        set(value) = prefs.edit().putBoolean(KEY_AUTO_BOOST, value).apply()

    var lastBoostAt: Long
        get() = prefs.getLong(KEY_LAST_BOOST, 0L)
        set(value) = prefs.edit().putLong(KEY_LAST_BOOST, value).apply()

    fun profile(): BoostProfile =
        runCatching { BoostProfile.valueOf(profileName) }.getOrDefault(BoostProfile.MAX)

    companion object {
        private const val PREFS_NAME = "game_boost_prefs"
        private const val KEY_TARGET_PACKAGE = "target_package"
        private const val KEY_TARGET_LABEL = "target_label"
        private const val KEY_PROFILE = "profile"
        private const val KEY_AUTO_BOOST = "auto_boost"
        private const val KEY_LAST_BOOST = "last_boost"
    }
}

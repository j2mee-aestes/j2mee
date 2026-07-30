package com.gameboost.tablet.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class TargetGameTest {

    @Test
    fun primaryPackageIsGlobalPlayStoreId() {
        assertEquals(
            "com.kurogame.wutheringwaves.global",
            TargetGame.PRIMARY_PACKAGE
        )
    }

    @Test
    fun resolvePrefersFirstInstalledCandidate() {
        val installed = setOf("com.kurogame.mingchao")
        val resolved = TargetGame.resolveInstalledPackage { it in installed }
        assertEquals("com.kurogame.mingchao", resolved)
    }

    @Test
    fun resolveFallsBackToPrimaryWhenNothingInstalled() {
        val resolved = TargetGame.resolveInstalledPackage { false }
        assertEquals(TargetGame.PRIMARY_PACKAGE, resolved)
    }
}

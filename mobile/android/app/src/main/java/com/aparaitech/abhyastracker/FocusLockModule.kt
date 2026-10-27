
package com.aparaitech.abhyastracker

import android.app.Activity
import android.app.ActivityManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FocusLockModule(
    private val appContext: ReactApplicationContext
) : ReactContextBaseJavaModule(appContext) {

    override fun getName(): String = "FocusLock"

    private fun lockTaskMode(): Int {
        val activity = appContext.currentActivity
            ?: return ActivityManager.LOCK_TASK_MODE_NONE

        val manager = activity.getSystemService(
            Context.ACTIVITY_SERVICE
        ) as ActivityManager

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            manager.lockTaskModeState
        } else {
            @Suppress("DEPRECATION")
            if (activity.isInLockTaskModeCompat()) {
                ActivityManager.LOCK_TASK_MODE_PINNED
            } else {
                ActivityManager.LOCK_TASK_MODE_NONE
            }
        }
    }

    @Suppress("DEPRECATION")
    private fun Activity.isInLockTaskModeCompat(): Boolean {
        val manager = getSystemService(
            Context.ACTIVITY_SERVICE
        ) as ActivityManager
        return manager.isInLockTaskMode
    }

    private fun createStatus() =
        Arguments.createMap().apply {
            val mode = lockTaskMode()

            putBoolean(
                "active",
                mode != ActivityManager.LOCK_TASK_MODE_NONE
            )
            putBoolean(
                "kioskMode",
                mode == ActivityManager.LOCK_TASK_MODE_LOCKED
            )
            putString(
                "mode",
                when (mode) {
                    ActivityManager.LOCK_TASK_MODE_PINNED -> "PINNED"
                    ActivityManager.LOCK_TASK_MODE_LOCKED -> "LOCKED"
                    else -> "NONE"
                }
            )
        }

    @ReactMethod
    fun getPinningStatus(promise: Promise) {
        try {
            promise.resolve(createStatus())
        } catch (error: Exception) {
            promise.reject("STATUS_FAILED", error.message, error)
        }
    }

    @ReactMethod
    fun startPinning(promise: Promise) {
        val activity = appContext.currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No active Android activity")
            return
        }

        activity.runOnUiThread {
            try {
                if (lockTaskMode() == ActivityManager.LOCK_TASK_MODE_NONE) {
                    activity.startLockTask()
                }

                // Report the mode Android actually entered.
                promise.resolve(createStatus())
            } catch (error: Exception) {
                promise.reject("PINNING_FAILED", error.message, error)
            }
        }
    }

    @ReactMethod
    fun stopPinning(promise: Promise) {
        val activity = appContext.currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No active Android activity")
            return
        }

        activity.runOnUiThread {
            try {
                if (lockTaskMode() != ActivityManager.LOCK_TASK_MODE_NONE) {
                    activity.stopLockTask()
                }

                promise.resolve(true)
            } catch (error: Exception) {
                promise.reject("UNPINNING_FAILED", error.message, error)
            }
        }
    }
}

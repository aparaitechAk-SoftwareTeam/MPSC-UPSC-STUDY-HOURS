package com.aparaitech.abhyastracker
import android.app.admin.DevicePolicyManager
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

    private fun getActivityManager(activity: Activity): ActivityManager {
        return activity.getSystemService(
            Context.ACTIVITY_SERVICE
        ) as ActivityManager
    }

    @Suppress("DEPRECATION")
    private fun getLockTaskMode(activity: Activity): Int {
        val manager = getActivityManager(activity)

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            manager.lockTaskModeState
        } else {
            if (manager.isInLockTaskMode) {
                ActivityManager.LOCK_TASK_MODE_PINNED
            } else {
                ActivityManager.LOCK_TASK_MODE_NONE
            }
        }
    }

    private fun isLockTaskPermitted(activity: Activity): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        val policyManager = activity.getSystemService(
            Context.DEVICE_POLICY_SERVICE
        ) as DevicePolicyManager

        policyManager.isLockTaskPermitted(activity.packageName)
    } else {
        false
    }
}
    private fun createStatus(activity: Activity) =
        Arguments.createMap().apply {
            val mode = getLockTaskMode(activity)

            putBoolean(
                "active",
                mode != ActivityManager.LOCK_TASK_MODE_NONE
            )

            putBoolean(
                "pinned",
                mode == ActivityManager.LOCK_TASK_MODE_PINNED
            )

            putBoolean(
                "kioskMode",
                mode == ActivityManager.LOCK_TASK_MODE_LOCKED
            )

            putBoolean(
                "lockTaskPermitted",
                isLockTaskPermitted(activity)
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
            val activity = appContext.currentActivity

            if (activity == null) {
                promise.reject(
                    "NO_ACTIVITY",
                    "No active Android activity"
                )
                return
            }

            promise.resolve(createStatus(activity))
        } catch (error: Exception) {
            promise.reject(
                "STATUS_FAILED",
                error.message ?: "Could not read lock status",
                error
            )
        }
    }

    @ReactMethod
    fun startPinning(promise: Promise) {
        val activity = appContext.currentActivity

        if (activity == null) {
            promise.reject(
                "NO_ACTIVITY",
                "No active Android activity"
            )
            return
        }

        activity.runOnUiThread {
            try {
                val currentMode = getLockTaskMode(activity)

                if (currentMode == ActivityManager.LOCK_TASK_MODE_NONE) {
                    activity.startLockTask()
                }

                // Return the actual mode entered by Android.
                // PINNED is not the same as fully restricted kiosk mode.
                promise.resolve(createStatus(activity))
            } catch (error: Exception) {
                promise.reject(
                    "PINNING_FAILED",
                    error.message ?: "Could not start Android screen pinning",
                    error
                )
            }
        }
    }

    @ReactMethod
    fun stopPinning(promise: Promise) {
        val activity = appContext.currentActivity

        if (activity == null) {
            promise.reject(
                "NO_ACTIVITY",
                "No active Android activity"
            )
            return
        }

        activity.runOnUiThread {
            try {
                val currentMode = getLockTaskMode(activity)

                if (currentMode != ActivityManager.LOCK_TASK_MODE_NONE) {
                    activity.stopLockTask()
                }

                promise.resolve(createStatus(activity))
            } catch (error: Exception) {
                promise.reject(
                    "UNPINNING_FAILED",
                    error.message ?: "Could not stop Android screen pinning",
                    error
                )
            }
        }
    }
}

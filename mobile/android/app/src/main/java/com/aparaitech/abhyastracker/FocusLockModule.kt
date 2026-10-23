package com.aparaitech.abhyastracker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FocusLockModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FocusLock"

    @ReactMethod
    fun startPinning(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No active Android activity")
            return
        }

        activity.runOnUiThread {
            try {
                activity.startLockTask()
                promise.resolve(true)
            } catch (error: Exception) {
                promise.reject("PINNING_FAILED", error.message, error)
            }
        }
    }

    @ReactMethod
    fun stopPinning(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No active Android activity")
            return
        }

        activity.runOnUiThread {
            try {
                activity.stopLockTask()
                promise.resolve(true)
            } catch (error: Exception) {
                promise.reject("UNPINNING_FAILED", error.message, error)
            }
        }
    }
}

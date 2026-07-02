package com.hanseo.meomun.widget

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

private const val WIDGET_PREFS_NAME = "meomun_widget"
private const val TODAY_WIDGET_SUMMARY_KEY = "today_widget_summary"

class MeomunWidgetModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "MeomunWidgetBridge"

  @ReactMethod
  fun saveTodayWidgetSummary(summaryJson: String, promise: Promise) {
    try {
      reactApplicationContext
        .getSharedPreferences(WIDGET_PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putString(TODAY_WIDGET_SUMMARY_KEY, summaryJson)
        .apply()

      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject(
        "E_WIDGET_SAVE_FAILED",
        "Unable to save today widget summary.",
        error,
      )
    }
  }
}
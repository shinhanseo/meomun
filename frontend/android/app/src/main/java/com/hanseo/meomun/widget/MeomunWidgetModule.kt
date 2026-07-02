package com.hanseo.meomun.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.glance.appwidget.updateAll
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

private const val WIDGET_PREFS_NAME = "meomun_widget"
private const val TODAY_WIDGET_SUMMARY_KEY = "today_widget_summary"
private const val WIDGET_LOG_TAG = "MeomunWidget"

class MeomunWidgetModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "MeomunWidgetBridge"

  @ReactMethod
  fun saveTodayWidgetSummary(summaryJson: String, promise: Promise) {
    try {
      val saved = reactApplicationContext
        .getSharedPreferences(WIDGET_PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putString(TODAY_WIDGET_SUMMARY_KEY, summaryJson)
        .commit()

      if (!saved) {
        promise.reject(
          "E_WIDGET_SAVE_FAILED",
          "Unable to commit today widget summary.",
        )
        return
      }

      CoroutineScope(Dispatchers.Default).launch {
        try {
          val context = reactApplicationContext.applicationContext

          MeomunTodayWidget().updateAll(context)
          requestLauncherWidgetRefresh(context)

          Log.d(WIDGET_LOG_TAG, "Saved and updated today widget: $summaryJson")
          promise.resolve(null)
        } catch (error: Exception) {
          promise.reject(
            "E_WIDGET_UPDATE_FAILED",
            "Unable to update today widget.",
            error,
          )
        }
      }
    } catch (error: Exception) {
      promise.reject(
        "E_WIDGET_SAVE_FAILED",
        "Unable to save today widget summary.",
        error,
      )
    }
  }

  private fun requestLauncherWidgetRefresh(context: Context) {
    val componentName = ComponentName(context, MeomunTodayWidgetReceiver::class.java)
    val appWidgetIds = AppWidgetManager
      .getInstance(context)
      .getAppWidgetIds(componentName)

    if (appWidgetIds.isEmpty()) {
      Log.d(WIDGET_LOG_TAG, "No installed Meomun widgets to refresh.")
      return
    }

    val updateIntent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).apply {
      component = componentName
      putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)
    }

    context.sendBroadcast(updateIntent)
    Log.d(
      WIDGET_LOG_TAG,
      "Requested launcher widget refresh: ${appWidgetIds.joinToString()}",
    )
  }
}

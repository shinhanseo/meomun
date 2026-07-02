package com.hanseo.meomun.widget

import android.content.Context
import android.content.ComponentName
import androidx.compose.runtime.Composable
import com.hanseo.meomun.MainActivity
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONObject

private const val WIDGET_PREFS_NAME = "meomun_widget"
private const val TODAY_WIDGET_SUMMARY_KEY = "today_widget_summary"

data class TodayWidgetSummary(
  val hasTodayRecord: Boolean,
  val emotionLabel: String?,
  val emotionEmoji: String?,
  val recordCount: Int,
  val latestPlaceName: String?,
  val deepLink: String,
)

class MeomunTodayWidget : GlanceAppWidget() {
  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val summary = loadTodayWidgetSummary(context)

    provideContent {
      MeomunTodayWidgetContent(summary)
    }
  }
}

class MeomunTodayWidgetReceiver : GlanceAppWidgetReceiver() {
  override val glanceAppWidget: GlanceAppWidget = MeomunTodayWidget()
}

@Composable
private fun MeomunTodayWidgetContent(summary: TodayWidgetSummary?) {
  val context = LocalContext.current

  Column(
    modifier = GlanceModifier
      .fillMaxSize()
      .background(WidgetColors.background)
      .clickable(actionStartActivity(openAppComponent(context)))
      .padding(16.dp),
  ) {
    if (summary?.hasTodayRecord == true) {
      RecordedContent(summary)
    } else {
      EmptyContent()
    }
  }
}

@Composable
private fun RecordedContent(summary: TodayWidgetSummary) {
  Row(
    modifier = GlanceModifier.fillMaxWidth(),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Text(
      text = summary.emotionEmoji ?: "•",
      style = TextStyle(fontSize = 28.sp),
    )

    Spacer(modifier = GlanceModifier.width(54.dp))

    Text(
      text = "오늘",
      style = TextStyle(
        color = WidgetColors.accent,
        fontSize = 11.sp,
        fontWeight = FontWeight.Medium,
      ),
    )
  }

  Spacer(modifier = GlanceModifier.height(12.dp))

  Text(
    text = "오늘의 감정은",
    style = TextStyle(
      color = WidgetColors.text,
      fontSize = 16.sp,
      fontWeight = FontWeight.Bold,
    ),
  )

  Text(
    text = "${summary.emotionLabel ?: "기록"}이네요",
    style = TextStyle(
      color = WidgetColors.text,
      fontSize = 16.sp,
      fontWeight = FontWeight.Bold,
    ),
  )

  summary.latestPlaceName?.let { placeName ->
    Spacer(modifier = GlanceModifier.height(4.dp))
    Text(
      text = placeName,
      style = TextStyle(
        color = WidgetColors.subtext,
        fontSize = 11.sp,
        fontWeight = FontWeight.Medium,
      ),
      maxLines = 1,
    )
  }

  Spacer(modifier = GlanceModifier.height(8.dp))

  Text(
    text = if (summary.recordCount == 1) "기록 보러가기 ›" else "${summary.recordCount}개 기록 보기 ›",
    style = TextStyle(
      color = WidgetColors.accent,
      fontSize = 11.sp,
      fontWeight = FontWeight.Bold,
    ),
  )
}

@Composable
private fun EmptyContent() {
  Text(
    text = "+",
    style = TextStyle(
      color = WidgetColors.accent,
      fontSize = 28.sp,
      fontWeight = FontWeight.Bold,
    ),
  )

  Spacer(modifier = GlanceModifier.height(14.dp))

  Text(
    text = "오늘은 어디에",
    style = TextStyle(
      color = WidgetColors.text,
      fontSize = 16.sp,
      fontWeight = FontWeight.Bold,
    ),
  )

  Text(
    text = "머물렀나요?",
    style = TextStyle(
      color = WidgetColors.text,
      fontSize = 16.sp,
      fontWeight = FontWeight.Bold,
    ),
  )

  Spacer(modifier = GlanceModifier.height(8.dp))

  Text(
    text = "눌러서 기록하기",
    style = TextStyle(
      color = WidgetColors.accent,
      fontSize = 11.sp,
      fontWeight = FontWeight.Bold,
    ),
  )
}

private fun loadTodayWidgetSummary(context: Context): TodayWidgetSummary? {
  val summaryJson = context
    .getSharedPreferences(WIDGET_PREFS_NAME, Context.MODE_PRIVATE)
    .getString(TODAY_WIDGET_SUMMARY_KEY, null)
    ?: return null

  return runCatching {
    val json = JSONObject(summaryJson)

    TodayWidgetSummary(
      hasTodayRecord = json.optBoolean("hasTodayRecord", false),
      emotionLabel = json.optStringOrNull("emotionLabel"),
      emotionEmoji = json.optStringOrNull("emotionEmoji"),
      recordCount = json.optInt("recordCount", 0),
      latestPlaceName = json.optStringOrNull("latestPlaceName"),
      deepLink = json.optString("deepLink", "meomun://record/new"),
    )
  }.getOrNull()
}

private fun JSONObject.optStringOrNull(name: String): String? {
  return if (has(name) && !isNull(name)) {
    optString(name).takeIf { it.isNotBlank() }
  } else {
    null
  }
}

private fun openAppComponent(context: Context): ComponentName {
  return ComponentName(context, MainActivity::class.java)
}

private object WidgetColors {
  val background = ColorProvider(Color(0xFFFFFBF7))
  val text = ColorProvider(Color(0xFF211C20))
  val subtext = ColorProvider(Color(0xFF6F676E))
  val accent = ColorProvider(Color(0xFF8B5BC4))
}

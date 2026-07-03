package com.hanseo.meomun.widget

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hanseo.meomun.R
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import org.json.JSONObject

private const val WIDGET_PREFS_NAME = "meomun_widget"
private const val TODAY_WIDGET_SUMMARY_KEY = "today_widget_summary"

data class TodayWidgetSummary(
  val hasTodayRecord: Boolean,
  val emotionCode: String?,
  val emotionLabel: String?,
  val emotionEmoji: String?,
  val recordCount: Int,
  val latestPlaceName: String?,
  val deepLink: String,
  val updatedAt: String,
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
  val deepLink = summary?.deepLink ?: "meomun://record/new"

  Column(
    modifier = GlanceModifier
      .fillMaxSize()
      .background(WidgetColors.background)
      .clickable(actionStartActivity(openDeepLinkIntent(context, deepLink)))
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
    EmotionMark(summary)

    Spacer(modifier = GlanceModifier.width(48.dp))

    TodayBadge()
  }

  Spacer(modifier = GlanceModifier.height(10.dp))

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
  PlusButton()

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
    text = "눌러서 기록하기 ›",
    style = TextStyle(
      color = WidgetColors.accent,
      fontSize = 11.sp,
      fontWeight = FontWeight.Medium,
    ),
  )
}

@Composable
private fun PlusButton() {
  Box(
    modifier = GlanceModifier
      .size(38.dp)
      .cornerRadius(13.dp)
      .background(WidgetColors.accent),
    contentAlignment = Alignment.Center,
  ) {
    Text(
      text = "+",
      style = TextStyle(
        color = WidgetColors.onAccent,
        fontSize = 24.sp,
        fontWeight = FontWeight.Medium,
      ),
    )
  }
}

@Composable
private fun TodayBadge() {
  Box(
    modifier = GlanceModifier
      .cornerRadius(18.dp)
      .background(WidgetColors.accentSurface)
      .padding(horizontal = 9.dp, vertical = 5.dp),
    contentAlignment = Alignment.Center,
  ) {
    Text(
      text = "오늘",
      style = TextStyle(
        color = WidgetColors.accent,
        fontSize = 11.sp,
        fontWeight = FontWeight.Medium,
      ),
    )
  }
}

@Composable
private fun EmotionMark(summary: TodayWidgetSummary) {
  val emotionImageResId = summary.emotionImageResId()

  Box(
    modifier = GlanceModifier
      .size(44.dp)
      .cornerRadius(14.dp)
      .background(summary.emotionBackground()),
    contentAlignment = Alignment.Center,
  ) {
    if (emotionImageResId != null) {
      Image(
        provider = ImageProvider(emotionImageResId),
        contentDescription = summary.emotionLabel ?: "감정",
        modifier = GlanceModifier.size(34.dp),
      )
    } else {
      Text(
        text = summary.emotionEmoji ?: "•",
        style = TextStyle(
          color = WidgetColors.text,
          fontSize = 27.sp,
          fontWeight = FontWeight.Medium,
        ),
      )
    }
  }
}

private fun loadTodayWidgetSummary(context: Context): TodayWidgetSummary? {
  val summaryJson = context
    .getSharedPreferences(WIDGET_PREFS_NAME, Context.MODE_PRIVATE)
    .getString(TODAY_WIDGET_SUMMARY_KEY, null)
    ?: return null

  return runCatching {
    val json = JSONObject(summaryJson)
    val updatedAt = json.optStringOrNull("updatedAt") ?: return@runCatching null

    if (!isToday(updatedAt)) {
      return@runCatching null
    }

    TodayWidgetSummary(
      hasTodayRecord = json.optBoolean("hasTodayRecord", false),
      emotionCode = json.optStringOrNull("emotionCode"),
      emotionLabel = json.optStringOrNull("emotionLabel"),
      emotionEmoji = json.optStringOrNull("emotionEmoji"),
      recordCount = json.optInt("recordCount", 0),
      latestPlaceName = json.optStringOrNull("latestPlaceName"),
      deepLink = json.optString("deepLink", "meomun://record/new"),
      updatedAt = updatedAt,
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

private fun isToday(isoString: String): Boolean {
  val date = parseIsoDate(isoString) ?: return false
  val today = Calendar.getInstance()
  val target = Calendar.getInstance().apply {
    time = date
  }

  return today.get(Calendar.YEAR) == target.get(Calendar.YEAR) &&
    today.get(Calendar.DAY_OF_YEAR) == target.get(Calendar.DAY_OF_YEAR)
}

private fun parseIsoDate(isoString: String): Date? {
  val patterns = listOf(
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    "yyyy-MM-dd'T'HH:mm:ss'Z'",
  )

  return patterns.firstNotNullOfOrNull { pattern ->
    runCatching {
      SimpleDateFormat(pattern, Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
      }.parse(isoString)
    }.getOrNull()
  }
}

private fun openDeepLinkIntent(context: Context, deepLink: String): Intent {
  return Intent(Intent.ACTION_VIEW, Uri.parse(deepLink)).apply {
    setPackage(context.packageName)
    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
  }
}

private fun TodayWidgetSummary.emotionImageResId(): Int? {
  return when (emotionCode) {
    "ANGRY" -> R.drawable.emotion_angry
    "ANXIOUS" -> R.drawable.emotion_anxious
    "CALM" -> R.drawable.emotion_calm
    "FLUTTER" -> R.drawable.emotion_flutter
    "HAPPY" -> R.drawable.emotion_happy
    "REFLECTIVE" -> R.drawable.emotion_reflective
    "SAD" -> R.drawable.emotion_sad
    "TIRED" -> R.drawable.emotion_tired
    else -> null
  }
}

private fun TodayWidgetSummary.emotionBackground(): ColorProvider {
  return when (emotionCode) {
    "ANGRY" -> ColorProvider(Color(0xFFFFE6E0))
    "ANXIOUS" -> ColorProvider(Color(0xFFF0E2FF))
    "CALM" -> ColorProvider(Color(0xFFE1F5E8))
    "FLUTTER" -> ColorProvider(Color(0xFFFFE6F5))
    "HAPPY" -> ColorProvider(Color(0xFFFFF5C7))
    "REFLECTIVE" -> ColorProvider(Color(0xFFE9E3FF))
    "SAD" -> ColorProvider(Color(0xFFE0F0FF))
    "TIRED" -> ColorProvider(Color(0xFFEDEDEF))
    else -> WidgetColors.surface
  }
}

private object WidgetColors {
  val background = ColorProvider(Color(0xFFFFFAF8))
  val surface = ColorProvider(Color(0xFFFFFDFB))
  val text = ColorProvider(Color(0xFF211C20))
  val subtext = ColorProvider(Color(0xFF6F676E))
  val accent = ColorProvider(Color(0xFF8B5BC4))
  val accentSurface = ColorProvider(Color(0xFFF0E5FA))
  val onAccent = ColorProvider(Color(0xFFFFFFFF))
}

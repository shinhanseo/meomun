import WidgetKit
import SwiftUI

private let appGroupId = "group.com.hanseo.meomun"
private let summaryKey = "today_widget_summary"

struct TodayWidgetSummary: Decodable {
  let hasTodayRecord: Bool
  let emotionCode: String?
  let emotionLabel: String?
  let emotionEmoji: String?
  let recordCount: Int
  let latestPlaceName: String?
  let latestRecordId: String?
  let deepLink: String
  let updatedAt: String
}

struct MeomunEntry: TimelineEntry {
  let date: Date
  let summary: TodayWidgetSummary?
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> MeomunEntry {
    MeomunEntry(date: Date(), summary: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (MeomunEntry) -> Void) {
    completion(MeomunEntry(date: Date(), summary: loadSummary()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<MeomunEntry>) -> Void) {
    let entry = MeomunEntry(date: Date(), summary: loadSummary())
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()

    completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
  }

  private func loadSummary() -> TodayWidgetSummary? {
    guard
      let defaults = UserDefaults(suiteName: appGroupId),
      let json = defaults.string(forKey: summaryKey),
      let data = json.data(using: .utf8)
    else {
      return nil
    }

    return try? JSONDecoder().decode(TodayWidgetSummary.self, from: data)
  }
}

struct MeomunWidgetEntryView: View {
  var entry: Provider.Entry

  var body: some View {
    widgetContent
      .containerBackground(WidgetPalette.backgroundGradient, for: .widget)
      .widgetURL(widgetURL)
  }

  private var widgetURL: URL? {
    if let summary = entry.summary {
      return URL(string: summary.deepLink)
    }

    return URL(string: "meomun://record/new")
  }

  @ViewBuilder
  private var widgetContent: some View {
    if let summary = entry.summary, summary.hasTodayRecord {
      recordedView(summary)
    } else {
      emptyView
    }
  }

  private func recordedView(_ summary: TodayWidgetSummary) -> some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(alignment: .center) {
        EmotionMark(summary: summary)

        Spacer()

        Text("오늘")
          .font(.system(size: 11, weight: .semibold))
          .foregroundStyle(WidgetPalette.accent)
          .padding(.horizontal, 9)
          .padding(.vertical, 5)
          .background(WidgetPalette.accent.opacity(0.12))
          .clipShape(Capsule())
      }

      Spacer(minLength: 9)

      Text("오늘의 감정은")
        .font(.system(size: 16, weight: .bold))
        .foregroundStyle(WidgetPalette.text)
        .lineLimit(1)

      Text("\(summary.emotionLabel ?? "기록")이네요")
        .font(.system(size: 16, weight: .bold))
        .foregroundStyle(WidgetPalette.text)
        .lineLimit(1)

      if let placeName = summary.latestPlaceName {
        Text(placeName)
          .font(.system(size: 11, weight: .medium))
          .foregroundStyle(WidgetPalette.subtext)
          .lineLimit(1)
          .padding(.top, 4)
      }

      Spacer(minLength: 6)

      HStack(spacing: 5) {
        Text(summary.recordCount == 1 ? "기록 보러가기" : "\(summary.recordCount)개 기록 보기")
          .font(.system(size: 11, weight: .semibold))

        Image(systemName: "chevron.right")
          .font(.system(size: 9, weight: .bold))
      }
      .foregroundStyle(WidgetPalette.accent)
    }
    .padding(16)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }

  private var emptyView: some View {
    VStack(alignment: .leading, spacing: 0) {
      Image(systemName: "plus")
        .font(.system(size: 18, weight: .semibold))
        .foregroundStyle(.white)
        .frame(width: 38, height: 38)
        .background(WidgetPalette.accentGradient)
        .clipShape(RoundedRectangle(cornerRadius: 13, style: .continuous))

      Spacer(minLength: 14)

      Text("오늘은 어디에")
        .font(.system(size: 16, weight: .bold))
        .foregroundStyle(WidgetPalette.text)
        .lineLimit(1)

      Text("머물렀나요?")
        .font(.system(size: 16, weight: .bold))
        .foregroundStyle(WidgetPalette.text)
        .lineLimit(1)
        .padding(.top, 1)

      Spacer(minLength: 8)

      Text("눌러서 기록하기")
        .font(.system(size: 11, weight: .semibold))
        .foregroundStyle(WidgetPalette.accent)
    }
    .padding(16)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }
}

private struct EmotionMark: View {
  let summary: TodayWidgetSummary

  var body: some View {
    ZStack {
      backgroundColor

      if let imageName {
        Image(imageName)
          .resizable()
          .scaledToFit()
          .frame(width: 34, height: 34)
      } else {
        Text(summary.emotionEmoji ?? "•")
          .font(.system(size: 28))
      }
    }
    .frame(width: 44, height: 44)
    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
  }

  private var imageName: String? {
    switch summary.emotionCode {
    case "ANGRY":
      return "EmotionAngry"
    case "ANXIOUS":
      return "EmotionAnxious"
    case "CALM":
      return "EmotionCalm"
    case "FLUTTER":
      return "EmotionFlutter"
    case "HAPPY":
      return "EmotionHappy"
    case "REFLECTIVE":
      return "EmotionReflective"
    case "SAD":
      return "EmotionSad"
    case "TIRED":
      return "EmotionTired"
    default:
      return nil
    }
  }

  private var backgroundColor: Color {
    switch summary.emotionCode {
    case "ANGRY":
      return Color(red: 1.00, green: 0.90, blue: 0.88)
    case "ANXIOUS":
      return Color(red: 0.94, green: 0.88, blue: 1.00)
    case "CALM":
      return Color(red: 0.88, green: 0.96, blue: 0.91)
    case "FLUTTER":
      return Color(red: 1.00, green: 0.90, blue: 0.96)
    case "HAPPY":
      return Color(red: 1.00, green: 0.96, blue: 0.78)
    case "REFLECTIVE":
      return Color(red: 0.91, green: 0.89, blue: 1.00)
    case "SAD":
      return Color(red: 0.88, green: 0.94, blue: 1.00)
    case "TIRED":
      return Color(red: 0.93, green: 0.93, blue: 0.94)
    default:
      return WidgetPalette.surface
    }
  }
}

private enum WidgetPalette {
  static let background = Color(red: 0.98, green: 0.97, blue: 0.95)
  static let backgroundGradient = LinearGradient(
    colors: [
      Color(red: 1.00, green: 0.99, blue: 0.97),
      Color(red: 0.98, green: 0.95, blue: 1.00),
      Color(red: 1.00, green: 0.97, blue: 0.94)
    ],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
  )
  static let accentGradient = LinearGradient(
    colors: [
      Color(red: 0.62, green: 0.39, blue: 0.86),
      Color(red: 0.44, green: 0.31, blue: 0.79)
    ],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
  )
  static let surface = Color.white.opacity(0.78)
  static let text = Color(red: 0.12, green: 0.10, blue: 0.11)
  static let subtext = Color(red: 0.42, green: 0.39, blue: 0.42)
  static let accent = Color(red: 0.55, green: 0.36, blue: 0.78)
}

struct MeomunWidget: Widget {
  let kind: String = "MeomunWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      MeomunWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("머문")
    .description("오늘 머문 감정과 장소를 보여줘요.")
    .supportedFamilies([.systemSmall])
  }
}

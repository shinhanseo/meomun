import WidgetKit
import SwiftUI

private let appGroupId = "group.com.hanseo.meomun"
private let summaryKey = "today_widget_summary"

struct TodayWidgetSummary: Decodable {
  let hasTodayRecord: Bool
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
    if let summary = entry.summary, summary.hasTodayRecord {
      VStack(alignment: .leading, spacing: 6) {
        Text(summary.emotionEmoji ?? "·")
          .font(.system(size: 28))

        Text(summary.emotionLabel ?? "오늘의 기록")
          .font(.system(size: 16, weight: .semibold))
          .foregroundStyle(.primary)

        if let placeName = summary.latestPlaceName {
          Text(placeName)
            .font(.system(size: 12))
            .foregroundStyle(.secondary)
            .lineLimit(1)
        }
      }
      .containerBackground(.background, for: .widget)
      .widgetURL(URL(string: summary.deepLink))
    } else {
      VStack(alignment: .leading, spacing: 6) {
        Text("오늘은 어디에")
          .font(.system(size: 15, weight: .semibold))

        Text("머물렀나요?")
          .font(.system(size: 15, weight: .semibold))
      }
      .containerBackground(.background, for: .widget)
      .widgetURL(URL(string: "meomun://record/new"))
    }
  }
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
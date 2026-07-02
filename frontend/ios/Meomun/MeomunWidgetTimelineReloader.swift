import Foundation
import WidgetKit

@objc(MeomunWidgetTimelineReloader)
final class MeomunWidgetTimelineReloader: NSObject {
  @objc static func reloadAllTimelines() {
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}

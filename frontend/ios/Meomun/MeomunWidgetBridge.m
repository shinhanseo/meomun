#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "Meomun-Swift.h"

static NSString *const MeomunWidgetAppGroup = @"group.com.hanseo.meomun";
static NSString *const MeomunTodayWidgetSummaryKey = @"today_widget_summary";

@interface MeomunWidgetBridge : NSObject <RCTBridgeModule>
@end

@implementation MeomunWidgetBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(saveTodayWidgetSummary
                  : (NSString *)summaryJson resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)
{
  NSUserDefaults *defaults =
      [[NSUserDefaults alloc] initWithSuiteName:MeomunWidgetAppGroup];

  if (defaults == nil) {
    reject(@"E_WIDGET_APP_GROUP_UNAVAILABLE",
           @"Unable to access the Meomun App Group user defaults.", nil);
    return;
  }

  [defaults setObject:summaryJson forKey:MeomunTodayWidgetSummaryKey];
  [defaults synchronize];
  [MeomunWidgetTimelineReloader reloadAllTimelines];

  resolve(nil);
}

@end

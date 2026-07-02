import { NativeModules, Platform } from 'react-native';

import type { TodayWidgetSummary } from './todayWidgetSummary';

type MeomunWidgetBridgeModule = {
  saveTodayWidgetSummary: (summaryJson: string) => Promise<void>;
};

const nativeWidgetBridge =
  NativeModules.MeomunWidgetBridge as MeomunWidgetBridgeModule | undefined;

export async function saveTodayWidgetSummary(
  summary: TodayWidgetSummary,
): Promise<void> {
  const summaryJson = JSON.stringify(summary);

  if (Platform.OS === 'ios' && nativeWidgetBridge) {
    try {
      await nativeWidgetBridge.saveTodayWidgetSummary(summaryJson);
      console.log('[today-widget:saved]', summary);
      return;
    } catch (error) {
      console.warn('[today-widget:save-failed]', error);
    }
  }

  console.log('[today-widget]', summary);
}

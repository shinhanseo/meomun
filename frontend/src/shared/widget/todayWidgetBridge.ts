import type { TodayWidgetSummary } from './todayWidgetSummary';

export async function saveTodayWidgetSummary(
  summary: TodayWidgetSummary,
): Promise<void> {
  // TODO: iOS App Group / Android SharedPreferences native bridge 연결
  console.log('[today-widget]', summary);
}
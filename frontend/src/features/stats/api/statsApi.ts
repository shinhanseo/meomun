import { apiClient } from '../../../shared/api/client';
import { MonthlyStatsResponse } from '../types/stats.types';

export async function getMonthlyStats(yearMonth: string) {
  const { data } = await apiClient.get<MonthlyStatsResponse>(
    '/api/stats/monthly',
    {
      params: { yearMonth },
    }
  );

  return data;
}
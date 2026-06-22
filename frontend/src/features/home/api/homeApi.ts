import { apiClient } from '../../../shared/api/client';
import type { MapRecord } from '../types/home.types';

export const homeApi = {
  getMapRecords: async (): Promise<MapRecord[]> => {
    const { data } = await apiClient.get<MapRecord[]>('/api/records/map');
    return data;
  }
}
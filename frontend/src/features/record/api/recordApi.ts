import { apiClient } from '../../../shared/api/client';
import type {
  CreateRecordRequest,
  PlaceRecordSummaryResponse,
  RecordResponse,
} from '../types/record.types';

export const recordApi = {
  async getRecordDetail(recordId: string) {
    const { data } = await apiClient.get<RecordResponse>(
      `/api/records/${recordId}`,
    );

    return data;
  },

  async createRecord(body: CreateRecordRequest) {
    const { data } = await apiClient.post<RecordResponse>(
      `/api/records`,
      body,
    );

    return data;
  },

  async getPlaceRecordSummary(kakaoPlaceId: string) {
    const { data } = await apiClient.get<PlaceRecordSummaryResponse>(
      `/api/records/place-summary`,
      {
        params: {
          kakaoPlaceId,
        },
      },
    );

    return data;
  },

  async editRecord(recordId: string, body: CreateRecordRequest) {
    const { data } = await apiClient.put<RecordResponse>(
      `/api/records/${recordId}`,
      body,
    );

    return data;
  },

  async deleteRecord(recordId: string) {
    await apiClient.delete(`/api/records/${recordId}`);
  },
};

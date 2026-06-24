import { apiClient } from "../../../shared/api/client";
import type { RecordResponse, CreateRecordRequest } from "../types/record.types";

export const recordApi = {
  async getRecordDetail(recordId: string) {
    const { data } = await apiClient.get<RecordResponse>(
      `/api/records/${recordId}`,
    );

    return data;
  },

  async createRecord(body: CreateRecordRequest) {
    const { data } = await apiClient.post<RecordResponse>(
      `/api/records`, body
    );
  },

  async deleteRecord(recordId: string) {
    await apiClient.delete(`/api/records/${recordId}`);
  },

};

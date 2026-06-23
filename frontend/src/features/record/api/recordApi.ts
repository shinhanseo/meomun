import { apiClient } from "../../../shared/api/client";
import type { RecordResponse } from "../types/record.types";

export const recordApi = {
  async getRecordDetail(recordId: string) {
    const { data } = await apiClient.get<RecordResponse>(
      `api/records/${recordId}`,
    );

    return data;
  }
}
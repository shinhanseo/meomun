import { apiClient } from '../../../shared/api/client';
import type {
  AllArchiveRequestParams,
  AllArchiveResponse,
  MonthlyArchiveRequestParams,
  MonthlyArchiveResponse,
} from '../types';

export const archiveApi = {
  async getAllArchive(params: AllArchiveRequestParams = {}) {
    const { data } = await apiClient.get<AllArchiveResponse>(
      '/api/archives/all',
      {
        params,
      },
    );

    return data;
  },

  async getMonthlyArchive(params: MonthlyArchiveRequestParams) {
    const { data } = await apiClient.get<MonthlyArchiveResponse>(
      '/api/archives/monthly',
      {
        params,
      },
    );

    return data;
  },
};
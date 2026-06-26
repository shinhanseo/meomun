import { apiClient } from '../../../shared/api/client';
import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveMonthOptionsResponse,
  AllArchiveRequestParams,
  AllArchiveResponse,
  MonthlyArchiveRequestParams,
  MonthlyArchiveResponse,
  EmotionArchiveDetailRequestParams,
  EmotionArchiveDetailResponse,
  EmotionArchiveResponse,
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

  async getArchiveMonthOptions() {
    const { data } = await apiClient.get<ArchiveMonthOptionsResponse>(
      '/api/archives/month-options',
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

  async getEmotionArchive() {
    const { data } = await apiClient.get<EmotionArchiveResponse>(
      '/api/archives/emotions',
    );

    return data;
  },

  async getEmotionArchiveDetail(
    emotion: EmotionCode,
    params: EmotionArchiveDetailRequestParams = {},
  ) {
    const { data } = await apiClient.get<EmotionArchiveDetailResponse>(
      `/api/archives/emotions/${emotion}/records`,
      {
        params,
      },
    );

    return data;
  },
};

import { apiClient } from '../../../shared/api/client';
import {
  AllArchiveRequestParams,
  AllArchiveResponse,
} from '../types/archive.types';

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
};
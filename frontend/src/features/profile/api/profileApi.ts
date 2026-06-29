import { apiClient } from '../../../shared/api/client';
import type { UserMeResponse } from '../types/profile.types';

export const profileApi = {
  async getUser() {
    const { data } = await apiClient.get<UserMeResponse>('/api/users/me');

    return data;
  },
};
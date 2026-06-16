export interface UserMeResponse {
  id: string;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMeRequest {
  nickname?: string | null;
}
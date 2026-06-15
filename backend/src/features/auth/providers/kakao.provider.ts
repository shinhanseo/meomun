import axios from 'axios';
import type { OAuthProfile } from '../auth.types.js';

interface KakaoUserResponse {
	id: number;
	kakao_account?: {
		email?: string;
		profile?: {
			nickname?: string;
		};
	};
}

export class KakaoProvider {
	async getProfile(kakaoAccessToken: string): Promise<OAuthProfile> {
		const response = await axios.get<KakaoUserResponse>(
			'https://kapi.kakao.com/v2/user/me',
			{
				headers: {
					Authorization: `Bearer ${kakaoAccessToken}`,
				},
				timeout: 5000,
			}
		);

		return {
			providerUserId: String(response.data.id),
			email: response.data.kakao_account?.email,
			nickname: response.data.kakao_account?.profile?.nickname,
		}
	}
}
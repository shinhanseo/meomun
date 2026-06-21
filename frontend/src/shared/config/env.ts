const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const resetAppStateOnBoot =
  process.env.EXPO_PUBLIC_RESET_APP_STATE_ON_BOOT === 'true';

if (!apiBaseUrl) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined');
}

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
  resetAppStateOnBoot,
};

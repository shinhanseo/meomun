const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined');
}

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
};
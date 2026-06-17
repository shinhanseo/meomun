import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),

  setRefreshToken: (refreshToken: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),

  removeRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
};
import { AppStoreState } from '../appStore/types';

export const selectIsAuthenticated = (state: AppStoreState) => {
  return !!state.currentAccount;
};

export const selectApiCredentials = (state: AppStoreState) => ({
  apiId: state.currentAccount?.apiId ?? null,
  apiHash: state.currentAccount?.apiHash ?? null,
  clearApiCredentials: state.clearApiCredentials,
});

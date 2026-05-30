import { AppStoreState } from '../appStore/types';

export const selectIsAuthenticated = (state: AppStoreState) => {
  return !!(state.apiId && state.apiHash);
};

export const selectApiCredentials = (state: AppStoreState) => ({
  apiId: state.apiId,
  apiHash: state.apiHash,
  setApiCredentials: state.setApiCredentials,
  clearApiCredentials: state.clearApiCredentials,
});

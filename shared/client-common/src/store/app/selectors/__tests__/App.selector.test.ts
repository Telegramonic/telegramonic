import { selectIsAuthenticated, selectApiCredentials } from '../App.selector';
import { AppStoreState } from '../../appStore/types';

describe('App selectors', () => {
  const mockState: AppStoreState = {
    currentAccount: {
      phone: '+1234567890',
      apiId: '123456',
      apiHash: 'abcde12345',
    },
    savedAccounts: [],
    authError: null,
    setCurrentAccount: jest.fn(),
    saveAccount: jest.fn(),
    removeAccount: jest.fn(),
    clearApiCredentials: jest.fn(),
    setAuthError: jest.fn(),
  };

  it('selectIsAuthenticated should return true when credentials are set', () => {
    expect(selectIsAuthenticated(mockState)).toBe(true);
  });

  it('selectIsAuthenticated should return false when credentials are empty', () => {
    const emptyState: AppStoreState = {
      ...mockState,
      currentAccount: null,
    };
    expect(selectIsAuthenticated(emptyState)).toBe(false);
  });

  it('selectApiCredentials should extract values and handlers', () => {
    const credentials = selectApiCredentials(mockState);
    expect(credentials.apiId).toBe('123456');
    expect(credentials.apiHash).toBe('abcde12345');
    expect(credentials.clearApiCredentials).toBeDefined();
  });
});

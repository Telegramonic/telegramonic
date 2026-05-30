import { selectIsAuthenticated, selectApiCredentials } from '../App.selector';
import { AppStoreState } from '../../appStore/types';

describe('App selectors', () => {
  const mockState: AppStoreState = {
    apiId: '123456',
    apiHash: 'abcde12345',
    setApiCredentials: jest.fn(),
    clearApiCredentials: jest.fn(),
  };

  it('selectIsAuthenticated should return true when credentials are set', () => {
    expect(selectIsAuthenticated(mockState)).toBe(true);
  });

  it('selectIsAuthenticated should return false when credentials are empty', () => {
    const emptyState: AppStoreState = {
      ...mockState,
      apiId: null,
      apiHash: null,
    };
    expect(selectIsAuthenticated(emptyState)).toBe(false);
  });

  it('selectApiCredentials should extract values and handlers', () => {
    const credentials = selectApiCredentials(mockState);
    expect(credentials.apiId).toBe('123456');
    expect(credentials.apiHash).toBe('abcde12345');
    expect(credentials.setApiCredentials).toBeDefined();
    expect(credentials.clearApiCredentials).toBeDefined();
  });
});

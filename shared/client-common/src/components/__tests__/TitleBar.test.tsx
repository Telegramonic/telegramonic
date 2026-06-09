import { screen } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import TitleBar from '../TitleBar';

// Mock server health hook
const mockUseServerHealth = jest.fn();
jest.mock('@services', () => ({
  useServerHealth: () => mockUseServerHealth(),
}));

describe('TitleBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders TitleBar successfully with Internet and TG indicators', () => {
    mockUseServerHealth.mockReturnValue({
      data: { status: 'connected', latency: 45 },
      isFetching: false,
      refetch: jest.fn(),
    });

    renderWithProvidersAndRouter(<TitleBar />);

    // Check brand text
    expect(screen.getByText('Telegramonic')).toBeInTheDocument();

    // Check TG connection status
    expect(screen.getByText('TG Connected: 45ms')).toBeInTheDocument();

    // Check Internet connection status
    expect(screen.getByText(/Internet: (Online|Offline)/)).toBeInTheDocument();
  });
});

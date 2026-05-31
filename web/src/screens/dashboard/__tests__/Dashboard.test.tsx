import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';
import Dashboard from '../Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock apiClient calls
const mockGetStats = jest.fn().mockResolvedValue({
  total_space: 1024 * 1024 * 1024 * 1024 * 10, // 10 TB
  used_space: 1024 * 1024 * 10,
  file_count: 6,
  folder_count: 3,
});

const mockGetFiles = jest.fn().mockImplementation((folderId, q) => {
  const allFiles = [
    { id: 1, name: 'Video_Tutorial.mp4', size: 1024*1024*10, created_at: new Date().toISOString(), icon_type: 'video' },
    { id: 2, name: 'Invoice_May.pdf', size: 245*1024, created_at: new Date().toISOString(), icon_type: 'file' },
  ];
  if (q) {
    return Promise.resolve(allFiles.filter(f => f.name.toLowerCase().includes(q.toLowerCase())));
  }
  return Promise.resolve(allFiles);
});

const mockLogOut = jest.fn().mockResolvedValue({ success: true });

jest.mock('@services', () => ({
  ...jest.requireActual('@services'),
  apiClient: {
    getStats: () => mockGetStats(),
    getFiles: (folderId: any, q: any) => mockGetFiles(folderId, q),
    logOut: () => mockLogOut(),
  },
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      appStore.getState().setApiCredentials('123456', 'abcde12345');
    });
  });

  it('should render the dashboard layout with mock file statistics', async () => {
    renderWithRouter(<Dashboard />);

    expect(await screen.findByText('Telegram Drive Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText(/MTProto active connection: API ID 123456/),
    ).toBeInTheDocument();

    // Stats
    expect(screen.getByText('Limitless')).toBeInTheDocument();
    expect(await screen.findByText('6 Files')).toBeInTheDocument();
    expect(screen.getByText('MTProto 2.0')).toBeInTheDocument();

    // Verify files are fetched and displayed
    expect(await screen.findByText('Video_Tutorial.mp4')).toBeInTheDocument();
    expect(screen.getByText('Invoice_May.pdf')).toBeInTheDocument();
  });

  it('should filter mock files by search query', async () => {
    renderWithRouter(<Dashboard />);

    expect(await screen.findByText('Telegram Drive Dashboard')).toBeInTheDocument();
    
    // Wait for initial files to load
    expect(await screen.findByText('Video_Tutorial.mp4')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search files...');
    
    // Change search value
    fireEvent.change(searchInput, { target: { value: 'Invoice' } });

    expect(await screen.findByText('Invoice_May.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Video_Tutorial.mp4')).not.toBeInTheDocument();
  });

  it('should show placeholder text when search result is empty', async () => {
    mockGetFiles.mockResolvedValueOnce([]); // Simulate empty response
    renderWithRouter(<Dashboard />);

    expect(await screen.findByText('Telegram Drive Dashboard')).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText('Search files...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentfile' } });

    expect(await screen.findByText('No files found')).toBeInTheDocument();
  });

  it('should clear credentials and navigate to login on disconnect button click', async () => {
    renderWithRouter(<Dashboard />);

    expect(await screen.findByText('Telegram Drive Dashboard')).toBeInTheDocument();
    const disconnectButton = screen.getByRole('button', {
      name: 'Disconnect Drive',
    });
    fireEvent.click(disconnectButton);

    await act(async () => {
      await Promise.resolve();
    });

    // Verify credentials are cleared in state
    expect(appStore.getState().apiId).toBeNull();
    expect(appStore.getState().apiHash).toBeNull();

    // Verify redirect called
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

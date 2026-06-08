import { screen, fireEvent } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import { SideNavBar } from '../SideNavBar';

// SideNavBar uses useStats() hook — mock the apiClient
jest.mock('@services/apiClient', () => ({
  apiClient: {
    getStats: jest.fn().mockResolvedValue({
      total_space: 100 * 1024 * 1024 * 1024 * 1024, // 100 TB
      used_space: 45.2 * 1024 * 1024 * 1024,         // 45.2 GB
      file_count: 5,
      folder_count: 2,
    }),
  },
}));

const defaultProps = {
  activeTab: 'all' as const,
  setActiveTab: jest.fn(),
  setCurrentFolderId: jest.fn(),
  onLogout: jest.fn(),
};

describe('SideNavBar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders "My Storage" heading', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.getByText('My Storage')).toBeInTheDocument();
  });

  it('renders navigation tabs: In my drive, Pinned', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.getByText('In my drive')).toBeInTheDocument();
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('calls setActiveTab with "pinned" when Pinned is clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Pinned'));
    expect(setActiveTab).toHaveBeenCalledWith('pinned');
  });

  it('calls onLogout when the Logout button is clicked', () => {
    const onLogout = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('does not render an Upgrade Storage button', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.queryByText('Upgrade Storage')).not.toBeInTheDocument();
  });

  it('displays storage stats after data resolves', async () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    // Usage string "45.2 GB / 100.0 TB" or similar should appear
    expect(await screen.findByText(/45\.2 GB/)).toBeInTheDocument();
  });
});

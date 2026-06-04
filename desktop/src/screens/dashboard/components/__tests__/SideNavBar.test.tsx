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
  onUpgradeStorage: jest.fn(),
  onLogout: jest.fn(),
};

describe('SideNavBar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders "My Storage" heading', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.getByText('My Storage')).toBeInTheDocument();
  });

  it('renders navigation tabs: All Files, Recent, Starred, Trash', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.getByText('All Files')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Starred')).toBeInTheDocument();
    expect(screen.getByText('Trash')).toBeInTheDocument();
  });

  it('calls setActiveTab with "recent" when Recent is clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Recent'));
    expect(setActiveTab).toHaveBeenCalledWith('recent');
  });

  it('calls setActiveTab with "starred" when Starred is clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Starred'));
    expect(setActiveTab).toHaveBeenCalledWith('starred');
  });

  it('calls setActiveTab with "trash" when Trash is clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Trash'));
    expect(setActiveTab).toHaveBeenCalledWith('trash');
  });

  it('calls onLogout when the Logout button is clicked', () => {
    const onLogout = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('calls onUpgradeStorage when the Upgrade button is clicked', () => {
    const onUpgradeStorage = jest.fn();
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} onUpgradeStorage={onUpgradeStorage} />);
    fireEvent.click(screen.getByText('Upgrade Storage'));
    expect(onUpgradeStorage).toHaveBeenCalledTimes(1);
  });

  it('displays storage stats after data resolves', async () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    // Usage string "45.2 GB / 100.0 TB" or similar should appear
    expect(await screen.findByText(/45\.2 GB/)).toBeInTheDocument();
  });
});

import { screen, fireEvent } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import { SideNavBar } from '../SideNavBar';

// SideNavBar uses useStats() hook — mock the apiClient
jest.mock('@services/apiClient', () => ({
  apiClient: {
    getStats: jest.fn().mockResolvedValue({
      total_space: 100 * 1024 * 1024 * 1024 * 1024, // 100 TB
      used_space: 45.2 * 1024 * 1024 * 1024, // 45.2 GB
      file_count: 5,
      folder_count: 2,
    }),
  },
}));

const defaultProps = {
  activeTab: 'all' as const,
  setActiveTab: jest.fn(),
  setCurrentFolderId: jest.fn(),
};

describe('SideNavBar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders navigation tabs: In my drive, Pinned', () => {
    renderWithProvidersAndRouter(<SideNavBar {...defaultProps} />);
    expect(screen.getByText('In my drive')).toBeInTheDocument();
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('calls setActiveTab with "pinned" when Pinned is clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(
      <SideNavBar {...defaultProps} setActiveTab={setActiveTab} />,
    );
    fireEvent.click(screen.getByText('Pinned'));
    expect(setActiveTab).toHaveBeenCalledWith('pinned');
  });

  it('renders Profile tab and calls setActiveTab with "profile" when clicked', () => {
    const setActiveTab = jest.fn();
    renderWithProvidersAndRouter(
      <SideNavBar {...defaultProps} setActiveTab={setActiveTab} />,
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Profile'));
    expect(setActiveTab).toHaveBeenCalledWith('profile');
  });
});
